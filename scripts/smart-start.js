#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import fetch from 'node-fetch';

class BlogDevServer {
  constructor() {
    this.serverProcess = null;
    this.currentMode = null;
    this.baseUrl = 'http://localhost:4321/my-blog';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkServerHealth() {
    try {
      const response = await fetch(this.baseUrl);
      return response.ok;
    } catch {
      return false;
    }
  }

  async checkBlogRouting() {
    try {
      // Test if blog post routes work
      const response = await fetch(`${this.baseUrl}/blog/macro-economics-intro`);
      return response.ok;
    } catch {
      return false;
    }
  }

  startServer(command, mode) {
    this.log(`Starting ${mode} server...`);
    this.currentMode = mode;
    
    this.serverProcess = spawn('npm', ['run', command], {
      stdio: 'pipe',
      shell: true
    });

    this.serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('ready in')) {
        this.log(`${mode} server ready!`, 'success');
        this.monitorServer();
      }
      console.log(output.trim());
    });

    this.serverProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    this.serverProcess.on('close', (code) => {
      this.log(`${mode} server stopped (code: ${code})`);
    });
  }

  async monitorServer() {
    setTimeout(async () => {
      const serverHealthy = await this.checkServerHealth();
      
      if (!serverHealthy) {
        this.log('Server not responding, restarting...', 'error');
        this.restart();
        return;
      }

      if (this.currentMode === 'dev') {
        const routingWorks = await this.checkBlogRouting();
        if (!routingWorks) {
          this.log('Blog routing not working in dev mode, switching to preview...', 'error');
          this.switchToPreview();
          return;
        }
      }

      this.log('Server healthy, blog routing working ✓', 'success');
      // Check again in 30 seconds
      setTimeout(() => this.monitorServer(), 30000);
    }, 5000); // Initial check after 5 seconds
  }

  async switchToPreview() {
    this.log('Building site for preview mode...');
    
    // Kill current server
    if (this.serverProcess) {
      this.serverProcess.kill();
    }

    // Build the site
    const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit', shell: true });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        this.log('Build successful, starting preview server...', 'success');
        this.startServer('preview', 'preview');
      } else {
        this.log('Build failed!', 'error');
      }
    });
  }

  restart() {
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    setTimeout(() => {
      this.startServer(this.currentMode === 'preview' ? 'preview' : 'dev', this.currentMode);
    }, 2000);
  }

  async start() {
    this.log('🚀 Starting intelligent blog development server...');
    this.log('📝 Content Creator Mode: Focus on writing, we handle the tech!');
    
    // Check if dist exists (previous build)
    const hasBuilt = existsSync('./dist');
    
    if (hasBuilt) {
      this.log('Previous build found, starting in preview mode for reliable routing...');
      this.startServer('preview', 'preview');
    } else {
      this.log('No previous build, starting in dev mode...');
      this.startServer('dev', 'dev');
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      this.log('Shutting down blog server...');
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      process.exit(0);
    });
  }
}

// Start the smart server
const blogServer = new BlogDevServer();
blogServer.start().catch(console.error);