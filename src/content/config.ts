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

export const collections = {
  blog: blogCollection,
};
