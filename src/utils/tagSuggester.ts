/**
 * AI-powered tag suggestion system for blog posts
 * Analyzes content and suggests relevant hashtags
 */

interface TagSuggestion {
  tag: string;
  confidence: number;
  reason: string;
}

export class TagSuggester {
  // Common themes and their related keywords
  private static themeKeywords = {
    'wealth-building': ['wealth', 'money', 'financial', 'investing', 'passive income', 'cash flow'],
    'real-estate': ['property', 'real estate', 'multifamily', 'rental', 'investment property'],
    'mindset': ['perspective', 'thinking', 'belief', 'mindset', 'psychology', 'mental model'],
    'strategy': ['framework', 'system', 'approach', 'methodology', 'strategy', 'process'],
    'personal-growth': ['growth', 'development', 'learning', 'skill', 'improvement', 'evolution'],
    'business': ['business', 'entrepreneur', 'company', 'startup', 'venture', 'enterprise'],
    'technology': ['tech', 'software', 'AI', 'automation', 'digital', 'innovation'],
    'finance': ['finance', 'trading', 'market', 'investment', 'portfolio', 'risk'],
    'relationships': ['relationship', 'network', 'connection', 'influence', 'leadership'],
    'observation': ['noticed', 'observed', 'seeing', 'pattern', 'trend', 'behavior'],
    'reflection': ['thinking about', 'reflecting', 'contemplating', 'considering', 'pondering'],
    'analysis': ['analyzing', 'breakdown', 'examination', 'deep dive', 'assessment'],
    'hypothesis': ['theory', 'hypothesis', 'assumption', 'belief', 'premise', 'conjecture'],
    'experiment': ['testing', 'trying', 'experiment', 'pilot', 'trial', 'attempt']
  };

  /**
   * Suggests tags based on content analysis
   * @param title Post title
   * @param description Post description
   * @param content Post content (optional)
   * @param mood Post mood (optional)
   * @param perspective Main perspective being explored (optional)
   * @returns Array of suggested tags with confidence scores
   */
  static suggestTags(
    title: string,
    description: string,
    content?: string,
    mood?: string,
    perspective?: string
  ): TagSuggestion[] {
    const allText = [title, description, content || '', perspective || ''].join(' ').toLowerCase();
    const suggestions: TagSuggestion[] = [];

    // Check theme keywords
    for (const [theme, keywords] of Object.entries(this.themeKeywords)) {
      const matches = keywords.filter(keyword => allText.includes(keyword.toLowerCase()));
      if (matches.length > 0) {
        suggestions.push({
          tag: theme,
          confidence: Math.min(matches.length * 0.3, 1.0),
          reason: `Found keywords: ${matches.join(', ')}`
        });
      }
    }

    // Add mood-based tags
    if (mood) {
      suggestions.push({
        tag: `${mood}-thoughts`,
        confidence: 0.8,
        reason: `Based on mood: ${mood}`
      });
    }

    // Extract potential tags from perspective
    if (perspective) {
      const perspectiveWords = perspective.toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 2);
      
      perspectiveWords.forEach(word => {
        suggestions.push({
          tag: word,
          confidence: 0.7,
          reason: `From perspective: ${perspective}`
        });
      });
    }

    // Look for specific patterns
    if (allText.includes('vs') || allText.includes('versus') || allText.includes('against')) {
      suggestions.push({
        tag: 'comparison',
        confidence: 0.8,
        reason: 'Contains comparison language'
      });
    }

    if (allText.includes('question') || allText.includes('wondering') || allText.includes('curious')) {
      suggestions.push({
        tag: 'inquiry',
        confidence: 0.7,
        reason: 'Contains questioning language'
      });
    }

    if (allText.includes('learned') || allText.includes('discovered') || allText.includes('realized')) {
      suggestions.push({
        tag: 'insight',
        confidence: 0.8,
        reason: 'Contains learning language'
      });
    }

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 8) // Limit to 8 suggestions
      .filter(s => s.confidence > 0.5); // Only confident suggestions
  }

  /**
   * Formats tags for display in blog post
   * @param tags Array of tag strings
   * @returns Formatted hashtag string
   */
  static formatHashtags(tags: string[]): string {
    return tags.map(tag => `#${tag.replace(/\s+/g, '-')}`).join(' ');
  }

  /**
   * Auto-generates tags and appends them to content
   * @param content Markdown content
   * @param frontmatter Post frontmatter
   * @returns Content with hashtags appended
   */
  static appendHashtags(content: string, frontmatter: any): string {
    const suggestions = this.suggestTags(
      frontmatter.title,
      frontmatter.description,
      content,
      frontmatter.mood,
      frontmatter.perspective
    );

    const suggestedTags = suggestions.map(s => s.tag);
    const allTags = [...new Set([...(frontmatter.tags || []), ...suggestedTags])];
    
    if (allTags.length === 0) return content;

    const hashtags = this.formatHashtags(allTags);
    
    return content + '\n\n---\n\n' + hashtags;
  }
}

// Example usage for development:
// const suggestions = TagSuggester.suggestTags(
//   "Testing My Investment Assumptions",
//   "Examining whether my beliefs about real estate match reality",
//   "I've been thinking about...",
//   "reflective",
//   "investment assumptions vs market reality"
// );
// console.log(suggestions);