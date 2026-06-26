import type {
    SiteConfig,
    ProfileConfig,
    LicenseConfig
} from "./types/config"

export const siteConfig: SiteConfig = {
    title: "Guztchian",
    subTitle: "Blog",

    favicon: "/favicon/favicon.ico", // Path of the favicon, relative to the /public directory

    pageSize: 6, // Number of posts per page
    toc: {
        enable: true,
        depth: 3 // Max depth of the table of contents, between 1 and 4
    },
    blogNavi: {
        enable: true // Whether to enable blog navigation in the blog footer
    },
    theme: {
        AOS: true, // Whether to enable AOS (Animate On Scroll) for animations
        LQIP: true, // Whether to enable LQIP (Low-Quality Image Placeholder) for image placeholders
        PhotoSwipe: true // Whether to enable PhotoSwipe for image viewer
    },
    music: {
        enable: true, // Whether to enable the corner music player
        tracks: [
            { title: 'Born a Stranger', src: '/audio/Born a Stranger.m4a' },
            { title: 'For River', src: '/audio/For River.m4a' },
            { title: 'To the Moon', src: '/audio/To the Moon.m4a' },
        ]
    }
}

export const profileConfig: ProfileConfig = {
    avatar: "/avatar.png",
    name: "Guztchian",
    description: "永远年轻，永远热泪盈眶",
    intro: {
        zh: "写代码，也写文字；做技术，也做记录。这里是我的笔记本——项目进展、技术思考、生活片刻，都在这里落笔。欢迎随意翻翻。",
        en: "Coder by craft, writer by choice. This is my notebook — where projects, ideas, and life quietly land on the page. Wander freely."
    },
    tags: ["Python", "C++", "TypeScript", "ROS2", "Astro", "Reinforcement Learning", "Obsidian"],
    indexPage: "https://dogogod.github.io",
    startYear: 2024,
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
