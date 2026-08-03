/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a NetEase Music Card.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.id - The NetEase Music song ID.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created NetEase Music Card component.
 */
export function MusicCardComponent(properties, children) {
    if (Array.isArray(children) && children.length !== 0)
        return h("div", { class: "hidden" }, [
            'Invalid directive. ("music" directive must be leaf type "::music{id="songId"}")',
        ]);

    const songId = String(properties.id ?? '').trim();
    if (!/^\d+$/.test(songId))
        return h(
            "div",
            { class: "hidden" },
            'Invalid song id. ("id" attribute must be provided)',
        );

    const nCover = h("div", { class: "music-cover", "data-card-cover": "" });
    const nTitle = h("div", { class: "music-title", "data-card-title": "" }, "Waiting for API...");
    const nArtist = h("div", { class: "music-artist", "data-card-artist": "" }, "Waiting...");

    return h(
        "a",
        {
            class: "card-music fetch-waiting no-styling",
            "data-music-card": "",
            "data-song-id": songId,
            href: `https://music.163.com/#/song?id=${songId}`, 
            target: "_blank", 
            rel: "noopener noreferrer" 
        },
        [
            h("div", { class: "music-card" }, [
                // 左侧封面图
                h("div", { class: "music-cover-wrapper" }, [
                    nCover,
                ]),
                // 右侧信息区
                h("div", { class: "music-info" }, [
                    h("div", { class: "music-header" }, [
                        nTitle,
                        nArtist,
                    ]),
                ])
            ]),
        ],
    );
}
