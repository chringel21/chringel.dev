import { z, defineCollection, image } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string(),
    type: z.string(),
    date: z.date(),
    cover: z
      .object({
        src: image().optional(),
        caption: z.string().optional(),
      })
      .optional(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    description: z.string(),
    syndication: z
      .object({
        twitter: z.string().optional(),
        mastodon: z.string().optional(),
      })
      .optional(),
  }),
});

const notesCollection = defineCollection({
  schema: z.object({
    author: z.string(),
    type: z.string(),
    date: z.date(),
    categories: z.array(z.string()),
    tags: z.array(z.string()),
    description: z.string(),
    bridgy: z.array(z.string()).optional(),
    syndication: z
      .object({
        twitter: z.string().optional(),
        mastodon: z.string().optional(),
      })
      .optional(),
    reply: z
      .object({
        url: z.string().optional(),
      })
      .optional(),
    like: z
      .object({
        url: z.string().optional(),
      })
      .optional(),
    repost: z
      .object({
        url: z.string().optional(),
      })
      .optional(),
    quote: z
      .object({
        url: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  notes: notesCollection,
};
