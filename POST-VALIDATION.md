# Blog Post Validation System

This system ensures all blog posts meet quality standards before being published.

## Automatic Validation

### Pre-commit Hook
- **Automatically runs** when you `git commit`
- **Prevents commits** if validation fails
- **Bypass** (not recommended): `git commit --no-verify`

### Pre-build Validation
- **Runs before** `npm run build`
- **Prevents deployment** of invalid posts
- **Ensures** live site always has valid content

## Manual Validation

### Quick Check
```bash
npm run validate
```

### Validate with Success Message
```bash
npm run validate:fix
```

## Validation Rules

### Required Fields ✅
Every blog post **must have** these frontmatter fields:
- `title`: String - Post title
- `description`: String - Brief description
- `pubDate`: Date (YYYY-MM-DD format)
- `tags`: Array - At least one tag

### Optional Fields ℹ️
These fields enhance your posts (recommended):
- `mood`: String - Writing mood (e.g., "exploratory", "analytical")
- `perspective`: String - Main viewpoint being examined
- `image`: String - Header image path
- `draft`: Boolean - Set to true to exclude from site

### Content Requirements ✅

#### File Format
- **File extension**: Must be `.md`
- **Filename**: Should use kebab-case (lowercase-with-hyphens)
- **Frontmatter**: Must start and end with `---`

#### Content Quality
- **Non-empty**: Post must have content after frontmatter
- **Minimum length**: At least 500 characters recommended
- **Sterling Perspective**: Consider adding this section for authentic self-examination

#### Image Validation
- **Paths**: Use `/my-blog/images/` for proper deployment
- **Existence**: Referenced images must exist in `public/images/`

## Example Valid Post Structure

```markdown
---
title: "Your Post Title"
description: "Brief description of what this post explores"
pubDate: 2025-01-15
tags: ["tag1", "tag2", "tag3"]
mood: "exploratory"
perspective: "How X connects to Y in unexpected ways"
image: "/my-blog/images/your-image.png"
---

# Your Post Title

Your content here...

## The Sterling Perspective

Your unique synthesis and self-examination...
```

## Common Validation Errors

### ❌ Missing Frontmatter
```
Error: Missing frontmatter (must start with ---)
```
**Fix**: Add `---` at the very beginning of your file

### ❌ Invalid Date Format
```
Error: Invalid pubDate format (use YYYY-MM-DD)
```
**Fix**: Use format like `2025-01-15`

### ❌ Missing Required Fields
```
Error: Missing required field: title
```
**Fix**: Add all required fields to frontmatter

### ❌ Empty Tags Array
```
Error: Tags must be a non-empty array
```
**Fix**: Add at least one tag: `tags: ["your-tag"]`

### ❌ Missing File Extension
```
Error: Blog posts must have .md extension
```
**Fix**: Rename file to end with `.md`

### ❌ Image Not Found
```
Error: Referenced image does not exist: /my-blog/images/missing.png
```
**Fix**: Add the image to `public/images/` or fix the path

## Warnings (Non-blocking) ⚠️

### Filename Format
```
Warning: Filename should use kebab-case
```
**Recommended**: Use `my-post-title.md` instead of `My Post Title.md`

### Image Paths
```
Warning: Image path should include base URL
```
**Recommended**: Use `/my-blog/images/` instead of `/images/`

### Content Length
```
Warning: Post content is quite short (< 500 characters)
```
**Recommended**: Add more content for better reader value

### Sterling Perspective
```
Warning: Consider adding "The Sterling Perspective" section
```
**Recommended**: Add this section for authentic self-examination (aligns with brand voice)

## Bypassing Validation

### For Testing (Local Only)
```bash
git commit --no-verify -m "test commit"
```

### For Emergency Fixes
```bash
# Fix the issue first, then:
git add .
git commit -m "emergency fix"
```

## Integration with Workflow

1. **Write your post** in `src/content/blog/`
2. **Add images** to `public/images/` if needed
3. **Test locally**: `npm run dev`
4. **Validate manually**: `npm run validate`
5. **Commit**: `git add . && git commit -m "message"`
   - Validation runs automatically
   - Fix any errors before proceeding
6. **Push**: `git push`
   - Build validation runs on GitHub
   - Deploy only happens if validation passes

## Benefits

✅ **Prevents broken deploys** - Catch issues before they go live  
✅ **Consistent quality** - All posts meet minimum standards  
✅ **Faster debugging** - Issues caught early with clear error messages  
✅ **Brand compliance** - Encourages "Sterling Perspective" sections  
✅ **SEO ready** - Ensures titles, descriptions, and tags are present  

This system helps maintain the quality and consistency of "The Sterling Perspective" blog while catching common mistakes before they reach your readers.