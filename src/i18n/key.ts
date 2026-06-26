export interface Translation {
    header: {
        home: string;
        archive: string;
        projects: string;
        about: string;
    };
    cover: {
        title: {
            archive: string;
            projects: string;
            about: string;
        };
        subTitle: {
            archive: string;
            projects: string;
            about: string;
        };
    };
    toc:string;
    category: string;
    pageNavigation: {
        previous: string;
        next: string;
    };
    button: {
        switchDarkMode: string;
        backToTop: string;
        backToBottom: string;
        menu: string;
        toc: string;
    }
    search: {
        placeholder: string;
        noresult: string;
        error: string;
    };
    license: {
        author: string;
        publishon: string;
    };
    blogNavi: {
        next: string;
        prev: string;
    },
    pagecard: {
        words: string;
        minutes: string;
        uncategorized: string;
    },
    langNote: {
        note: string;
        description: string;
    },
    draftNote: {
        warning: string;
        description: string;
    },
    page404: {
        title: string;
        subTitle: string;
        backToHome: string;
        backToPreview: string;
        notice: string;
    },
    themeInfo: {
        light: string;
        dark: string;
        system: string;
    },
    projectStatus: {
        active: string;
        maintained: string;
        experiment: string;
        archived: string;
    }
}