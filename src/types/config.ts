export type SiteConfig = {
    title: string;
    subTitle: string;

    favicon: string;

    pageSize: number;
    toc: {
        enable: boolean;
        depth: number;
    };
    blogNavi: {
        enable: boolean;
    };
    theme: {
        AOS: boolean;
        LQIP: boolean;
        PhotoSwipe: boolean;
    };
    music: {
        enable: boolean;
        tracks: { title: string; src: string }[];
    }
}

export type ProfileConfig = {
    avatar: string;
    name: string;
    description: string;
    intro: {
        zh: string;
        en: string;
    };
    tags: string[];
    indexPage?: string;
    startYear: number;
    links?: {
        name: string;
        url: string;
        icon: string;
        color: string;
    }[];
}

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};