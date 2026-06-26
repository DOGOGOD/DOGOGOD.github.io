import type { Translation } from "@i18n/key";

const translation: Translation = {
    header: {
        home: "Home",
        archive: "Archive",
        projects: "Projects",
        about: "About",
    },
    cover: {
        title: {
            archive: "Archive",
            projects: "Projects",
            about: "About",
        },
        subTitle: {
            archive: "Total of {count} articles",
            projects: "Things I've built with my own hands",
            about: "O ever youthful, O ever weeping",
        }
    },
    toc: "Contents",
    category: "Category",
    pageNavigation: {
        previous: "Prev",
        next: "Next",
    },
    button: {
        switchDarkMode: "Switch Dark Mode",
        backToTop: "Back to Top",
        backToBottom: "Back to Bottom",
        menu: "Menu",
        toc: "Contents",
    },
    search: {
        placeholder: "Enter keywords to start searching",
        noresult: "No results found.",
        error: "Search error occurred. Please try again later."
    },
    license: {
        author: "Author",
        publishon: "Published on"
    },
    blogNavi: {
        next: "Next Blog",
        prev: "Previous Blog"
    },
    pagecard: {
        words: "words",
        minutes: "min read",
        uncategorized: "Uncategorized"
    },
    langNote: {
        note: "Note: ",
        description: "This page does not support English, using the default language version"
    },
    draftNote: {
        warning: "Draft Warning: ",
        description: "This article is a draft and only appears in the testing environment. It will not be displayed in the production environment."
    },
    page404: {
        title: "404 - Void Realm",
        subTitle: "It looks like you've stumbled into a code wasteland that hasn't been developed yet.",
        backToHome: "Home",
        backToPreview: "Previous Page",
        notice: "Perhaps you can try:"
    },
    themeInfo: {
        light: "Switch to Light Mode",
        dark: "Switch to Dark Mode",
        system: "Switch to System Mode"
    },
    projectStatus: {
        active: "Active",
        maintained: "Maintained",
        experiment: "Experimental",
        archived: "Archived"
    }
}

export default translation;