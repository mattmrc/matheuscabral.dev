import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../data/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const blog = await getCollection('blog');

  return rss({
    title: site.name,
    description: site.description,
    site: context.site!.toString(),
    items: blog
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.summary,
        link: `/blog/${post.id}/`,
      })),
  });
}
