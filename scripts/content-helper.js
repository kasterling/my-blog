#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ContentHelper {
  constructor() {
    this.blogDir = path.join(__dirname, '../src/content/blog');
  }

  log(message, type = 'info') {
    const emoji = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[type] || '📝';
    
    console.log(`${emoji} ${message}`);
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  generateTemplate(title, tags = []) {
    const today = new Date().toISOString().split('T')[0];
    
    return `---
title: "${title}"
description: ""
pubDate: ${today}
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
mood: ""
perspective: ""
draft: true
---

# ${title}

## Introduction


## The Sterling Perspective


## Conclusion

`;
  }

  async createPost(title, tags = []) {
    const slug = this.slugify(title);
    const filename = `${slug}.md`;
    const filepath = path.join(this.blogDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      this.log(`Post already exists: ${filename}`, 'warning');
      return false;
    }

    // Ensure blog directory exists
    if (!fs.existsSync(this.blogDir)) {
      fs.mkdirSync(this.blogDir, { recursive: true });
    }

    // Generate content
    const content = this.generateTemplate(title, tags);
    
    // Write file
    fs.writeFileSync(filepath, content, 'utf-8');
    
    this.log(`Created new post: ${filename}`, 'success');
    this.log(`Location: ${filepath}`, 'info');
    this.log(`Edit the file to add your content, then remove 'draft: true'`, 'info');
    
    return true;
  }

  listDrafts() {
    if (!fs.existsSync(this.blogDir)) {
      this.log('No blog directory found', 'warning');
      return;
    }

    const files = fs.readdirSync(this.blogDir);
    const drafts = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filepath = path.join(this.blogDir, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      
      if (content.includes('draft: true')) {
        drafts.push(file);
      }
    }

    if (drafts.length === 0) {
      this.log('No drafts found', 'info');
    } else {
      this.log(`Found ${drafts.length} draft(s):`, 'info');
      drafts.forEach(draft => {
        console.log(`  📄 ${draft}`);
      });
    }
  }

  publishDraft(filename) {
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }

    const filepath = path.join(this.blogDir, filename);
    
    if (!fs.existsSync(filepath)) {
      this.log(`File not found: ${filename}`, 'error');
      return false;
    }

    let content = fs.readFileSync(filepath, 'utf-8');
    
    if (!content.includes('draft: true')) {
      this.log(`Post is already published: ${filename}`, 'warning');
      return false;
    }

    // Remove draft status
    content = content.replace('draft: true', 'draft: false');
    
    fs.writeFileSync(filepath, content, 'utf-8');
    
    this.log(`Published: ${filename}`, 'success');
    return true;
  }

  showStats() {
    if (!fs.existsSync(this.blogDir)) {
      this.log('No blog directory found', 'warning');
      return;
    }

    const files = fs.readdirSync(this.blogDir);
    let published = 0;
    let drafts = 0;
    const tags = new Set();

    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      const filepath = path.join(this.blogDir, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      
      if (content.includes('draft: true')) {
        drafts++;
      } else {
        published++;
      }

      // Extract tags
      const tagMatch = content.match(/tags:\s*\[(.*?)\]/);
      if (tagMatch) {
        const fileTags = tagMatch[1].split(',').map(tag => tag.trim().replace(/"/g, ''));
        fileTags.forEach(tag => tags.add(tag));
      }
    }

    console.log('\n📊 Blog Statistics');
    console.log('━'.repeat(20));
    console.log(`📝 Total posts: ${published + drafts}`);
    console.log(`✅ Published: ${published}`);
    console.log(`📄 Drafts: ${drafts}`);
    console.log(`🏷️  Unique tags: ${tags.size}`);
    console.log(`🏷️  Tags: ${Array.from(tags).join(', ')}`);
  }

  showHelp() {
    console.log('\n📝 Content Helper Commands');
    console.log('━'.repeat(30));
    console.log('npm run content:new "Post Title"     - Create new draft post');
    console.log('npm run content:new "Title" tag1,tag2 - Create post with tags');
    console.log('npm run content:drafts              - List all draft posts');
    console.log('npm run content:publish filename    - Publish a draft post');
    console.log('npm run content:stats               - Show blog statistics');
    console.log('npm run content:help                - Show this help');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const helper = new ContentHelper();

switch (command) {
  case 'new':
    if (!args[1]) {
      helper.log('Please provide a post title', 'error');
      helper.log('Usage: npm run content:new "My Post Title"', 'info');
      process.exit(1);
    }
    
    const title = args[1];
    const tags = args[2] ? args[2].split(',').map(tag => tag.trim()) : [];
    
    helper.createPost(title, tags);
    break;

  case 'drafts':
    helper.listDrafts();
    break;

  case 'publish':
    if (!args[1]) {
      helper.log('Please provide a filename', 'error');
      helper.log('Usage: npm run content:publish filename.md', 'info');
      process.exit(1);
    }
    
    helper.publishDraft(args[1]);
    break;

  case 'stats':
    helper.showStats();
    break;

  case 'help':
  default:
    helper.showHelp();
    break;
}