# CLAUDE.md - Blog Project Context

## Project Overview
This is "The Sterling Perspective" - a perspective-based blog built with Astro and deployed to GitHub Pages at `https://kasterling.github.io/my-blog`.

## Key Project Details

### Blog Philosophy
- **Perspective-focused content** - No rigid categories, authentic exploration of ideas
- **"Examining perspectives against perceptions"** - Main theme
- **Organic tagging** - Categories emerge naturally through content, not predetermined
- **Dynamic hashtag generation** - AI analyzes content and suggests relevant tags

### Technical Stack
- **Astro** static site generator
- **GitHub Pages** deployment (automatic via GitHub Actions)
- **TypeScript** for type safety
- **Responsive design** with modern CSS

### Content Structure
```yaml
# Post frontmatter schema:
title: string
description: string  
pubDate: date
tags: string[] (auto-generated + manual)
mood?: string (reflective, analytical, exploratory, etc.)
perspective?: string (main viewpoint being examined)
image?: string
draft?: boolean
```

### Key Features Implemented
1. **Flexible content schema** - removed rigid categories
2. **Tag suggestion system** (`src/utils/tagSuggester.ts`) - analyzes content and suggests hashtags
3. **Mood and perspective tracking** - captures authentic mindset
4. **Professional responsive design** - mobile-first approach
5. **GitHub Actions deployment** (`.github/workflows/deploy.yml`)

### Important Files
- `src/content/config.ts` - Content collection schema
- `src/layouts/BlogPost.astro` - Post template with mood/perspective indicators
- `src/layouts/Layout.astro` - Main site layout
- `src/pages/index.astro` - Homepage showcasing recent perspectives
- `src/utils/tagSuggester.ts` - AI tag suggestion system
- `brand-voice-guide.md` - Original brand guidelines (preserved)

### Project Status
✅ **COMPLETED AND DEPLOYED**
- Blog structure created from scratch (replaced Hugo)
- Astro implementation with perspective-based content
- GitHub repository configured: `https://github.com/kasterling/my-blog`
- GitHub Pages deployment active
- Local development ready at `/Users/keithsterling/Desktop/my-blog`

### Next Steps for User
1. **Create first post** in `src/content/blog/`
2. **Use the tagging system** - tags auto-generate based on content analysis
3. **Write authentically** - capture perspectives vs perceptions
4. **Push changes** - automatic deployment to GitHub Pages

### Development Commands
```bash
cd /Users/keithsterling/Desktop/my-blog
npm run dev          # Local development
npm run build        # Production build
git add . && git commit -m "message" && git push  # Deploy
```

### Key Design Decisions Made
- **Removed Hugo** - started fresh with Astro for better flexibility
- **No preset categories** - let themes emerge organically through tagging
- **Mood + perspective fields** - capture authentic writing context
- **AI tag suggestion** - builds taxonomy automatically
- **Professional but personal** - reflects "examining perspectives" theme

The blog is ready for authentic perspective-based writing with automatic categorization.