# Image Workflow for The Sterling Perspective

## Image Strategy

Each blog post should have **unique, thematically relevant images** that enhance the reader's understanding and create visual appeal.

### Image Types Needed

1. **Header Image** - Main image for homepage tiles and post headers (1200x600px recommended)
2. **Supporting Images** - 2-3 images within post content to illustrate key points
3. **Optional: Charts/Diagrams** - For data-driven posts

## File Organization

```
/public/images/posts/
├── ai-prophecy-header.jpg                    # Header for AI prophecy post
├── ai-prophecy/                              # Supporting images folder
│   ├── ancient-scroll-modern-tech.jpg
│   ├── surveillance-systems.jpg
│   └── ai-decision-tree.jpg
├── children-ai-education-header.jpg          # Header for teaching careers post
├── children-ai-education/                    # Supporting images folder
│   ├── classroom-technology.jpg
│   ├── education-data-chart.jpg
│   └── parent-child-discussion.jpg
└── [post-slug]-header.jpg                    # Pattern for future posts
```

## Recommended Image Specifications

### Header Images (Homepage Tiles + Post Headers)
- **Dimensions**: 1200x600px (2:1 ratio)
- **Format**: JPG (optimized for web)
- **Style**: Professional, thought-provoking, not sensational
- **Content**: Should visually represent the post's main theme

### Supporting Images (Within Posts)
- **Dimensions**: 800x400px or 1000x600px
- **Format**: JPG or PNG (PNG for charts/diagrams)
- **Style**: Consistent with header image aesthetic
- **Purpose**: Illustrate specific points, break up text, enhance understanding

## Image Creation Process

### Step 1: Generate Header Image
1. **Identify core theme** of your post
2. **Create AI prompt** using established style guidelines
3. **Generate image** using preferred AI tool
4. **Name file**: `[post-slug]-header.jpg`
5. **Upload to**: `/public/images/posts/`

### Step 2: Create Supporting Images
1. **Identify 2-3 key concepts** that need visual representation
2. **Create folder**: `/public/images/posts/[post-slug]/`
3. **Generate supporting images** with consistent style
4. **Upload to post folder**

### Step 3: Update Post Files
1. **Update frontmatter**: Change `image:` field to your custom header
2. **Add images to content**: Use markdown syntax within post
3. **Test display**: Check homepage tiles and post layout

## AI Image Generation Guidelines

### Style Consistency
- **Mood**: Professional, contemplative, scholarly
- **Colors**: Warm golds, soft earth tones, muted blues (matching blog brand)
- **Lighting**: Soft, warm lighting suggesting wisdom/reflection
- **Composition**: Clean, uncluttered, focus on main subject

### Content Guidelines
- **Avoid**: Dramatic, apocalyptic, or fear-inducing imagery
- **Prefer**: Thoughtful, analytical, educational imagery
- **Include**: Elements that connect to "examining perspectives"

### Example Prompts

**For AI/Technology Posts:**
```
A thoughtful composition featuring [specific elements], warm golden lighting, professional and contemplative mood, soft earth tones, clean modern aesthetic, suggesting wisdom and analysis rather than drama
```

**For Parenting/Family Posts:**
```
A warm, intimate scene showing [family elements], soft natural lighting, conveying connection and growth, earth tones and gentle colors, professional photography style, emotional but not sentimental
```

**For Economic/Data Posts:**
```
Clean, modern visualization of [economic concepts], professional business aesthetic, muted colors, clear and educational rather than alarming, sophisticated design suggesting thoughtful analysis
```

## Markdown Usage in Posts

### Header Image
Header images are automatically displayed from frontmatter:
```yaml
image: "/my-blog/images/posts/your-post-header.jpg"
```

### Supporting Images in Content
```markdown
![Descriptive alt text](/my-blog/images/posts/your-post/supporting-image.jpg)

*Caption: Brief explanation of what the image shows and how it relates to your point.*
```

### Image Placement Strategy
- **After introduction**: Set visual context
- **Between major sections**: Break up long text blocks
- **Before conclusion**: Reinforce main themes

## Quality Control Checklist

### Before Publishing
- [ ] Header image reflects post theme accurately
- [ ] All images use correct `/my-blog/` base path
- [ ] Supporting images enhance rather than distract
- [ ] Alt text is descriptive and helpful
- [ ] Image files are optimized for web (under 500KB each)
- [ ] Images display correctly on both homepage and post page
- [ ] Visual style is consistent with brand

### File Management
- [ ] Images uploaded to correct directories
- [ ] File names are descriptive and use kebab-case
- [ ] No unused images left in directories
- [ ] Image paths in markdown are correct

## Future Enhancements

### Potential Additions
- **Image optimization script** - Automatically resize/compress uploads
- **Alt text generator** - AI-assisted descriptive text creation
- **Style template library** - Saved prompts for consistent generation
- **Batch upload tool** - Admin interface for easier image management

---

*This workflow ensures each post has unique, thematically relevant imagery that enhances the reader experience while maintaining visual consistency across The Sterling Perspective blog.*