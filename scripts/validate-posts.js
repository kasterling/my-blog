#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const REQUIRED_FIELDS = ['title', 'description', 'pubDate', 'tags'];
const OPTIONAL_FIELDS = ['mood', 'perspective', 'image', 'draft'];

class PostValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  log(type, file, message) {
    const entry = `${file}: ${message}`;
    if (type === 'error') {
      this.errors.push(entry);
      console.error(`❌ ERROR - ${entry}`);
    } else {
      this.warnings.push(entry);
      console.warn(`⚠️  WARNING - ${entry}`);
    }
  }

  validateFrontmatter(content, filename) {
    // Check if file has frontmatter
    if (!content.startsWith('---')) {
      this.log('error', filename, 'Missing frontmatter (must start with ---)');
      return null;
    }

    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      this.log('error', filename, 'Invalid frontmatter format');
      return null;
    }

    const frontmatterText = frontmatterMatch[1];
    let frontmatter;

    try {
      // Parse YAML-like frontmatter (simplified)
      frontmatter = this.parseFrontmatter(frontmatterText);
    } catch (error) {
      this.log('error', filename, `Invalid frontmatter syntax: ${error.message}`);
      return null;
    }

    return frontmatter;
  }

  parseFrontmatter(text) {
    const frontmatter = {};
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
        }
      }
      
      frontmatter[key] = value;
    }
    
    return frontmatter;
  }

  validateRequiredFields(frontmatter, filename) {
    for (const field of REQUIRED_FIELDS) {
      if (!frontmatter[field]) {
        this.log('error', filename, `Missing required field: ${field}`);
      } else if (field === 'tags' && (!Array.isArray(frontmatter[field]) || frontmatter[field].length === 0)) {
        this.log('error', filename, 'Tags must be a non-empty array');
      }
    }
  }

  validatePubDate(frontmatter, filename) {
    if (frontmatter.pubDate) {
      const date = new Date(frontmatter.pubDate);
      if (isNaN(date.getTime())) {
        this.log('error', filename, 'Invalid pubDate format (use YYYY-MM-DD)');
      }
    }
  }

  validateContent(content, filename) {
    const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    // Check for content after frontmatter
    if (bodyContent.trim().length === 0) {
      this.log('error', filename, 'Post has no content after frontmatter');
    }

    // Check for Sterling Perspective section (based on brand guide)
    if (!bodyContent.includes('Sterling Perspective') && !bodyContent.includes('## The Sterling Perspective')) {
      this.log('warning', filename, 'Consider adding "The Sterling Perspective" section for authentic self-examination');
    }

    // Check for very short posts
    if (bodyContent.length < 500) {
      this.log('warning', filename, 'Post content is quite short (< 500 characters)');
    }
  }

  validateImagePaths(content, filename) {
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const imagePath = match[1];
      
      if (imagePath.startsWith('/my-blog/images/')) {
        // Check if image exists in public/images
        const localPath = path.join(__dirname, '../public/images/', imagePath.replace('/my-blog/images/', ''));
        if (!fs.existsSync(localPath)) {
          this.log('error', filename, `Referenced image does not exist: ${imagePath}`);
        }
      } else if (imagePath.startsWith('/images/')) {
        this.log('warning', filename, `Image path should include base URL: ${imagePath} -> /my-blog${imagePath}`);
      }
    }
  }

  validateFile(filepath) {
    const filename = path.basename(filepath);
    
    // Check file extension
    if (!filename.endsWith('.md')) {
      this.log('error', filename, 'Blog posts must have .md extension');
      return;
    }

    // Check filename format (should be kebab-case)
    const nameWithoutExt = filename.replace('.md', '');
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(nameWithoutExt)) {
      this.log('warning', filename, 'Filename should use kebab-case (lowercase with hyphens)');
    }

    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      
      // Validate frontmatter
      const frontmatter = this.validateFrontmatter(content, filename);
      if (!frontmatter) return;
      
      // Validate required fields
      this.validateRequiredFields(frontmatter, filename);
      
      // Validate pubDate
      this.validatePubDate(frontmatter, filename);
      
      // Validate content
      this.validateContent(content, filename);
      
      // Validate image paths
      this.validateImagePaths(content, filename);
      
      console.log(`✅ ${filename} - Basic validation passed`);
      
    } catch (error) {
      this.log('error', filename, `Failed to read file: ${error.message}`);
    }
  }

  validateAllPosts() {
    console.log('🔍 Validating blog posts...\n');
    
    if (!fs.existsSync(BLOG_DIR)) {
      console.error(`❌ Blog directory not found: ${BLOG_DIR}`);
      return false;
    }

    const files = fs.readdirSync(BLOG_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    if (mdFiles.length === 0) {
      console.warn('⚠️  No blog posts found');
      return true;
    }

    for (const file of mdFiles) {
      this.validateFile(path.join(BLOG_DIR, file));
    }

    console.log('\n📊 Validation Summary:');
    console.log(`✅ Posts validated: ${mdFiles.length}`);
    console.log(`❌ Errors: ${this.errors.length}`);
    console.log(`⚠️  Warnings: ${this.warnings.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS FOUND:');
      this.errors.forEach(error => console.log(`   ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    return this.errors.length === 0;
  }
}

// Run validation
const validator = new PostValidator();
const success = validator.validateAllPosts();

process.exit(success ? 0 : 1);