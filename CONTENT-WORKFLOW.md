# Content Creator Workflow

**Focus on writing. We handle the tech.**

## Quick Start - Preview Your Blog

```bash
npm run preview
```

That's it! This single command:
- ✅ Starts the best server for your content
- ✅ Automatically fixes routing issues
- ✅ Monitors server health
- ✅ Switches modes if needed
- ✅ Validates your posts before publishing

## Your Simple Content Creation Process

### 1. Start Preview Server
```bash
npm run preview
```
Open your browser to the URL shown (usually `http://localhost:4321/my-blog`)

### 2. Create New Posts
- Create new `.md` files in `src/content/blog/`
- Use kebab-case names: `my-new-post.md`
- The server automatically detects changes

### 3. Add Images
- Place images in `public/images/`
- Reference as: `![Alt text](/my-blog/images/your-image.png)`

### 4. Publish When Ready
```bash
git add .
git commit -m "Add new post: Your Title"
git push
```
The validation system prevents bad posts from being published.

## Post Template

Copy this structure for new posts:

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO and previews"
pubDate: 2025-01-XX
tags: ["tag1", "tag2", "tag3"]
mood: "exploratory"  # optional: reflective, analytical, curious
perspective: "What viewpoint you're examining"  # optional
image: "/my-blog/images/your-header.png"  # optional
---

# Your Post Title

Your content here...

## The Sterling Perspective

Your authentic self-examination and synthesis...
```

## What Happens Automatically

### ✅ Smart Server Management
- Starts in the best mode for your content
- Automatically switches if routing breaks
- Monitors and restarts if issues occur
- You never need to choose dev vs preview

### ✅ Content Validation
- Checks posts before commits
- Prevents broken deployments
- Clear error messages if something's wrong
- Automatic validation on build

### ✅ Deployment
- Push to GitHub automatically deploys
- Validation runs before deployment
- Live site updates within minutes

## Simple Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run preview` | Start preview server (recommended) |
| `npm run validate` | Check posts manually |
| `git add . && git commit -m "message" && git push` | Publish |

## Troubleshooting

### Server Issues
The smart server handles most issues automatically. If something seems stuck:
1. Stop with `Ctrl+C`
2. Run `npm run preview` again

### Blog Posts Not Showing
1. Check the terminal output for validation errors
2. Ensure your post has proper frontmatter
3. Make sure the file ends with `.md`

### Validation Errors
Read the error messages - they tell you exactly what to fix:
- Missing required fields
- Invalid date formats
- Missing images
- Incorrect file structure

### Images Not Loading
- Ensure images are in `public/images/`
- Use paths like `/my-blog/images/filename.png`
- Check spelling and capitalization

## Focus Areas

As the content creator, focus on:
- ✍️ **Writing authentic perspectives**
- 🔍 **Examining your perceptions vs reality**
- 🔗 **Connecting ideas across domains**
- 📝 **Adding "Sterling Perspective" conclusions**

The technical infrastructure handles itself, letting you focus on what matters: exploring ideas and sharing genuine insights.

## Getting Help

If something isn't working:
1. Check the terminal output for clear error messages
2. Review `POST-VALIDATION.md` for validation details
3. The system is designed to give you helpful error messages

**Remember**: One command (`npm run preview`) handles everything. Focus on the content, not the technology.