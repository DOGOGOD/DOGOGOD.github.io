/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
    if (Array.isArray(children) && children.length !== 0)
        return h("div", { class: "hidden" }, [
            'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
        ]);

    const repo = String(properties.repo ?? '').trim();
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
        return h(
            "div",
            { class: "hidden" },
            'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
        );

    // 预定义各部分节点
    const nAvatar = h("div", { class: "gc-avatar", "data-card-avatar": "" });
    const nLanguage = h("span", { class: "gc-language", "data-card-language": "" }, "…");
    const nDescription = h("div", { class: "gc-description", "data-card-description": "" }, "Loading repository…");
    const nStars = h("div", { class: "gc-stars", "data-card-stars": "" }, "…");
    const nForks = h("div", { class: "gc-forks", "data-card-forks": "" }, "…");
    const nLicense = h("div", { class: "gc-license", "data-card-license": "" }, "…");

    const nTitle = h("div", { class: "gc-titlebar" }, [
        h("div", { class: "gc-titlebar-left" }, [
            h("div", { class: "gc-owner" }, [
                nAvatar,
                h("div", { class: "gc-user" }, repo.split("/")[0]),
            ]),
            h("div", { class: "gc-divider" }, "/"),
            h("div", { class: "gc-repo" }, repo.split("/")[1]),
        ]),
        h("div", { class: "github-logo" }),
    ]);

    return h(
        "a",
        {
            class: "card-github fetch-waiting no-styling",
            href: `https://github.com/${encodeURI(repo)}`,
            target: "_blank",
            rel: "noopener noreferrer",
            "data-github-card": "",
            "data-repo": repo,
            "aria-label": `GitHub repository ${repo}`,
        },
        [
            nTitle,
            nDescription,
            h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
        ],
    );
}
