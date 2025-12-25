import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    stack: z.array(z.string()),
    highlights: z.array(z.string()),
    links: z
      .object({
        repo: z.string().url().optional(),
        demo: z.string().url().optional(),
        caseStudy: z.string().url().optional(),
      })
      .optional(),
    featured: z.boolean().default(false),
    status: z.string().optional(),
    cover: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()),
    readingTime: z.string().optional(),
  }),
});

export const collections = { projects, blog };
