#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SmartDevServer {
  constructor() {
    this.currentServer = null;
    this.serverType = null;
    this.healthCheckInterval = null;
    this.fallbackAttempted = false;
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      server: '🚀'
    }[type] || '📝';
    
    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  async validatePosts() {
    this.log('Validating blog posts...', 'info');
    
    return new Promise((resolve) => {
      const validator = spawn('node', ['scripts/validate-posts.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      let output = '';
      validator.stdout.on('data', (data) => {
        output += data.toString();
      });

      validator.stderr.on('data', (data) => {
        output += data.toString();
      });

      validator.on('close', (code) => {
        if (code === 0) {
          this.log('Post validation passed', 'success');
          resolve(true);
        } else {
          this.log('Post validation failed - continuing with warnings', 'warning');
          console.log(output);
          resolve(false); // Continue anyway for development
        }
      });
    });
  }

  async checkServerHealth(port = 4321) {
    try {
      const response = await fetch(`http://localhost:${port}/`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async waitForServer(port = 4321, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await this.checkServerHealth(port)) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return false;
  }

  async testNavigation(port = 4321) {
    try {
      // Test main page
      const mainResponse = await fetch(`http://localhost:${port}/`);
      if (!mainResponse.ok) return false;

      // Test blog route
      const blogResponse = await fetch(`http://localhost:${port}/blog/macro-economics-intro`);
      return blogResponse.ok;
    } catch {
      return false;
    }
  }

  startServer(mode = 'dev') {
    return new Promise((resolve, reject) => {
      this.log(`Starting Astro ${mode} server...`, 'server');
      
      const astroCommand = mode === 'dev' ? 'dev' : 'preview';
      this.currentServer = spawn('npm', ['run', astroCommand], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      this.serverType = mode;
      let serverStarted = false;

      this.currentServer.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);

        // Detect when server is ready
        if (output.includes('Local') && output.includes('4321') && !serverStarted) {
          serverStarted = true;
          resolve();
        }
      });

      this.currentServer.stderr.on('data', (data) => {
        const output = data.toString();
        console.error(output);
        
        // Don't reject on warnings, only on critical errors
        if (output.includes('Error:') && output.includes('EADDRINUSE')) {
          reject(new Error('Port already in use'));
        }
      });

      this.currentServer.on('close', (code) => {
        if (code !== 0 && !serverStarted) {
          reject(new Error(`Server exited with code ${code}`));
        }
      });

      this.currentServer.on('error', (error) => {
        reject(error);
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!serverStarted) {
          reject(new Error('Server startup timeout'));
        }
      }, 30000);
    });
  }

  stopServer() {
    if (this.currentServer) {
      this.log('Stopping current server...', 'info');
      this.currentServer.kill('SIGTERM');
      this.currentServer = null;
      this.serverType = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  startHealthMonitoring() {
    this.log('Starting health monitoring...', 'info');
    
    this.healthCheckInterval = setInterval(async () => {
      const isHealthy = await this.checkServerHealth();
      
      if (!isHealthy) {
        this.log('Server health check failed', 'warning');
        
        if (!this.fallbackAttempted && this.serverType === 'dev') {
          this.log('Attempting fallback to preview server...', 'warning');
          await this.fallbackToPreview();
        } else {
          this.log('Restarting server...', 'warning');
          await this.restart();
        }
      }
    }, 10000); // Check every 10 seconds
  }

  async fallbackToPreview() {
    this.fallbackAttempted = true;
    this.stopServer();
    
    try {
      // Build first
      this.log('Building project for preview...', 'info');
      await this.buildProject();
      
      // Start preview server
      await this.startServer('preview');
      await this.waitForServer();
      
      const navWorks = await this.testNavigation();
      if (navWorks) {
        this.log('Preview server started successfully with working navigation', 'success');
        this.startHealthMonitoring();
      } else {
        this.log('Preview server navigation test failed', 'error');
      }
    } catch (error) {
      this.log(`Fallback failed: ${error.message}`, 'error');
    }
  }

  async buildProject() {
    return new Promise((resolve, reject) => {
      const build = spawn('npm', ['run', 'build'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      let output = '';
      build.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      build.stderr.on('data', (data) => {
        output += data.toString();
        console.error(data.toString());
      });

      build.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  }

  async restart() {
    this.stopServer();
    
    try {
      if (this.serverType === 'preview') {
        await this.buildProject();
      }
      
      await this.startServer(this.serverType);
      await this.waitForServer();
      this.log('Server restarted successfully', 'success');
    } catch (error) {
      this.log(`Restart failed: ${error.message}`, 'error');
    }
  }

  async start() {
    try {
      // Show welcome message
      console.log('\n🎯 Smart Blog Development Server');
      console.log('━'.repeat(50));
      console.log('👤 Focus on writing. We handle the technical stuff.');
      console.log('🔄 Automatic server switching and health monitoring');
      console.log('📝 Content validation included\n');

      // Validate posts first
      await this.validatePosts();

      // Try dev server first
      this.log('Attempting to start development server...', 'server');
      
      try {
        await this.startServer('dev');
        await this.waitForServer();
        
        // Test navigation
        const navWorks = await this.testNavigation();
        
        if (navWorks) {
          this.log('Development server is running with working navigation', 'success');
          this.showSuccessMessage('dev');
          this.startHealthMonitoring();
        } else {
          this.log('Navigation test failed, switching to preview mode...', 'warning');
          await this.fallbackToPreview();
        }
        
      } catch (error) {
        this.log(`Dev server failed: ${error.message}`, 'warning');
        this.log('Falling back to preview server...', 'info');
        await this.fallbackToPreview();
      }

    } catch (error) {
      this.log(`Critical error: ${error.message}`, 'error');
      process.exit(1);
    }
  }

  showSuccessMessage(mode) {
    const serverUrl = 'http://localhost:4321';
    console.log('\n🎉 Your blog is ready!');
    console.log('━'.repeat(30));
    console.log(`🌐 Server: ${serverUrl}`);
    console.log(`⚙️  Mode: ${mode === 'dev' ? 'Development (live reload)' : 'Preview (production build)'}`);
    console.log('🔍 Health monitoring: Active');
    console.log('\n📝 Content Creation Tips:');
    console.log('   • Create new posts in src/content/blog/');
    console.log('   • Use kebab-case filenames (my-post.md)');
    console.log('   • Tags are auto-generated from content');
    console.log('   • Validation runs automatically');
    console.log('\n⌨️  Press Ctrl+C to stop the server\n');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Smart Dev Server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down Smart Dev Server...');
  process.exit(0);
});

// Start the smart dev server
const server = new SmartDevServer();
server.start().catch(error => {
  console.error(`❌ Failed to start server: ${error.message}`);
  process.exit(1);
});