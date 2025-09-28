import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    suggestedTags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean().default(false),
    mood: z.string().optional(), // reflective, analytical, exploratory, etc.
    perspective: z.string().optional() // main viewpoint being examined
  }),
});

export const collections = { blog };