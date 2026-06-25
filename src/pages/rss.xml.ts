import rss from "@astrojs/rss";
import { getBlogEntrySort } from "../utils/content-utils"
import { siteConfig, profileConfig } from '../config';
import type { APIContext } from "astro";
import { i18n } from "astro:config/client";

export async function GET(context: APIContext) {
    const defaultLang = i18n?.defaultLocale || "zh-cn";
    const blog = await getBlogEntrySort(defaultLang);
    return rss({
        title: `${siteConfig.title} - ${siteConfig.subTitle}`,
        description: profileConfig.description,
        site: context.site ?? "https://momo.motues.top",
        items: blog.slice(0, 20).map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.id}/`,
        })),
    })
}