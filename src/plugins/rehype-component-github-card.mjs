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
    const nLanguage = h("span", { class: "gc-language", "data-card-language": "" }, "Waiting...");
    const nDescription = h("div", { class: "gc-description", "data-card-description": "" }, "Waiting for api.github.com...");
    const nStars = h("div", { class: "gc-stars", "data-card-stars": "" }, "00K");
    const nForks = h("div", { class: "gc-forks", "data-card-forks": "" }, "0K");
    const nLicense = h("div", { class: "gc-license", "data-card-license": "" }, "0K");

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
        },
        [
            nTitle,
            nDescription,
            h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
        ],
    );
}
