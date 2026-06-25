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
    comments: {
        enable: true, // Whether to enable comments
        platform: "default", // Comment platform, set "default" to use Momo-backend, also supports "twikoo"
        backendUrl: "https://api-momo.motues.top" // Backend URL for comments
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
    avatar: "assets/Motues.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    name: "Guztchian",
    description: "Life is colorful!",
    indexPage: "https://www.motues.top",
    startYear: 2024,
}

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};
