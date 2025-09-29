#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DeployHelper {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      deploy: '🚀'
    }[type] || '📝';
    
    console.log(`${emoji} [${timestamp}] ${message}`);
  }

  async runCommand(command, args, description) {
    this.log(description, 'info');
    
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      child.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        process.stdout.write(text);
      });

      child.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        process.stderr.write(text);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(new Error(`${command} failed with code ${code}: ${errorOutput}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  async validateBeforeDeploy() {
    try {
      await this.runCommand('node', ['scripts/validate-posts.js'], 'Validating blog posts...');
      this.log('Post validation passed', 'success');
      return true;
    } catch (error) {
      this.log('Post validation failed', 'error');
      console.log(error.message);
      return false;
    }
  }

  async buildProject() {
    try {
      await this.runCommand('npm', ['run', 'build'], 'Building project...');
      this.log('Build completed successfully', 'success');
      return true;
    } catch (error) {
      this.log('Build failed', 'error');
      return false;
    }
  }

  async commitAndPush(message) {
    try {
      // Add all changes
      await this.runCommand('git', ['add', '.'], 'Staging changes...');
      
      // Check if there are changes to commit
      try {
        const status = await this.runCommand('git', ['status', '--porcelain'], 'Checking for changes...');
        if (!status.trim()) {
          this.log('No changes to commit', 'warning');
          return true;
        }
      } catch {
        // Continue if status check fails
      }

      // Commit changes
      await this.runCommand('git', ['commit', '-m', message], 'Committing changes...');
      
      // Push to GitHub
      await this.runCommand('git', ['push'], 'Pushing to GitHub...');
      
      this.log('Successfully pushed to GitHub', 'success');
      return true;
    } catch (error) {
      this.log('Git operations failed', 'error');
      console.log(error.message);
      return false;
    }
  }

  async deploy(commitMessage = null) {
    console.log('\n🚀 Blog Deployment Process');
    console.log('━'.repeat(40));
    
    try {
      // Step 1: Validate posts
      const validationPassed = await this.validateBeforeDeploy();
      if (!validationPassed) {
        this.log('Deployment aborted due to validation errors', 'error');
        return false;
      }

      // Step 2: Build project
      const buildPassed = await this.buildProject();
      if (!buildPassed) {
        this.log('Deployment aborted due to build errors', 'error');
        return false;
      }

      // Step 3: Commit and push
      const defaultMessage = `Deploy blog updates - ${new Date().toLocaleDateString()}`;
      const message = commitMessage || defaultMessage;
      
      const gitPassed = await this.commitAndPush(message);
      if (!gitPassed) {
        this.log('Deployment completed but git operations failed', 'warning');
        return false;
      }

      // Success!
      console.log('\n🎉 Deployment Successful!');
      console.log('━'.repeat(25));
      console.log('🌐 Your blog will be live at: https://kasterling.github.io/my-blog');
      console.log('⏱️  GitHub Pages typically takes 1-2 minutes to update');
      console.log('🔄 GitHub Actions will handle the final deployment');
      
      return true;

    } catch (error) {
      this.log(`Deployment failed: ${error.message}`, 'error');
      return false;
    }
  }

  showHelp() {
    console.log('\n🚀 Deployment Helper');
    console.log('━'.repeat(20));
    console.log('npm run deploy                     - Deploy with default message');
    console.log('npm run deploy "Custom message"    - Deploy with custom commit message');
    console.log('\nThis command will:');
    console.log('  1. ✅ Validate all blog posts');
    console.log('  2. 🔨 Build the project');
    console.log('  3. 📤 Commit and push to GitHub');
    console.log('  4. 🌐 Trigger GitHub Pages deployment');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const helper = new DeployHelper();

if (args.includes('--help') || args.includes('-h')) {
  helper.showHelp();
} else {
  const commitMessage = args[0];
  helper.deploy(commitMessage).catch(error => {
    console.error(`❌ Deployment failed: ${error.message}`);
    process.exit(1);
  });
}