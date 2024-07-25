// ==UserScript==
// @name         Reddit Image Downloader
// @description  Adds a button to download images from Reddit posts
// @version      1.0
// @author       Alexander Bays, 956MB
// @namespace    https://github.com/956MB/reddit-download-button
// @match        https://*.reddit.com/*
// @match        https://*.redd.it/*
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const createButton = (postId, count, type) => {
        const btn = document.createElement("button");
        btn.className = "reddit-image-downloader-button button border-md flex flex-row justify-center items-center mr-sm h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover";
        btn.setAttribute("rpl", "");
        btn.setAttribute("data-post-click-location", "download-button");
        btn.setAttribute("data-post-id", postId);
        btn.setAttribute("style", "height: var(--size-button-sm-h); font: var(--font-button-sm)");
        btn.setAttribute("type", "button");

        const text = `Download ${type}${count > 1 ? `s (${count})` : ""}`;
        const imageIcon = `<svg rpl="" aria-hidden="true" class="icon-download" fill="currentColor" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 2.497h-28c-1.099 0-2 0.901-2 2v23.006c0 1.099 0.9 2 2 2h28c1.099 0 2-0.901 2-2v-23.006c0-1.099-0.901-2-2-2zM30 27.503l-28-0v-5.892l8.027-7.779 8.275 8.265c0.341 0.414 0.948 0.361 1.379 0.035l3.652-3.306 6.587 6.762c0.025 0.025 0.053 0.044 0.080 0.065v1.85zM30 22.806l-5.876-6.013c-0.357-0.352-0.915-0.387-1.311-0.086l-3.768 3.282-8.28-8.19c-0.177-0.214-0.432-0.344-0.709-0.363-0.275-0.010-0.547 0.080-0.749 0.27l-7.309 7.112v-14.322h28v18.309zM23 12.504c1.102 0 1.995-0.894 1.995-1.995s-0.892-1.995-1.995-1.995-1.995 0.894-1.995 1.995c0 1.101 0.892 1.995 1.995 1.995z"></path>
        </svg>`;

        btn.innerHTML = `
            <span class="flex items-center">
                <span class="flex text-16 mr-[var(--rem6)]">${imageIcon}</span>
                <span>${text}</span>
            </span>
            <faceplate-screen-reader-content>${text}</faceplate-screen-reader-content>
        `;

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadMedia(postId);
        });

        return btn;
    };

    const getPostTitle = (post) => {
        const title = post.querySelector('h1[id^="post-title-"]')?.textContent.trim() || post.getAttribute("post-title") || "Untitled";
        return title.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    };

    const getHighestResUrl = (img) => {
        const zoomable = img.closest(".media-lightbox-img").querySelector(".zoomable-img-wrapper img");
        if (zoomable) return zoomable.src;
        const srcset = img.getAttribute("srcset");

        if (srcset) {
            const sources = srcset.split(",").map((src) => {
                const [url, width] = src.trim().split(" ");
                return { url, width: parseInt(width) };
            }).sort((a, b) => b.width - a.width);

            return sources[0].url;
        }

        return img.src;
    };

    const sendNotification = (count) => {
        if ("Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(`Download Complete`, {
                    body: `Successfully downloaded ${count} media file${count > 1 ? 's' : ''}.`
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification(`Download Complete`, {
                            body: `Successfully downloaded ${count} media file${count > 1 ? 's' : ''}.`
                        });
                    }
                });
            }
        }
    };

    const addButtons = () => {
        document.querySelectorAll("shreddit-post").forEach((post) => {
            const postId = post.id, shadowRoot = post.shadowRoot;
            if (!shadowRoot) return;
            const targetDiv = shadowRoot.querySelector("div.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start");
            if (!targetDiv || targetDiv.querySelector(".reddit-image-downloader-button")) return;
            const mediaContainer = post.querySelector('div[slot="post-media-container"]');
            if (!mediaContainer) return;

            let count = 0, type = "Media";
            const gallery = mediaContainer.querySelector("gallery-carousel");
            const video = mediaContainer.querySelector("shreddit-player");
            const src = video?.querySelector("source")?.src;

            if (gallery) {
                count = mediaContainer.querySelectorAll("gallery-carousel ul li").length;
                type = "Image";
            } else if (mediaContainer.querySelector("shreddit-aspect-ratio")) {
                count = 1;
                type = "Image";

            }

            if (video && ((src?.includes("mp4") && !src?.includes("gif")) || src?.includes("m3u8"))) return;
            if (count === 0) return;

            const shareBtn = targetDiv.querySelector('slot[name="share-button"]');
            const btn = createButton(postId, count, type);

            if (shareBtn) {
                shareBtn.insertAdjacentElement("afterend", btn);
            } else {
                const awardBtn = targetDiv.querySelector("award-button");

                if (awardBtn && awardBtn.nextElementSibling?.nextElementSibling) {
                    awardBtn.nextElementSibling.nextElementSibling.insertAdjacentElement("afterend", btn);
                }
            }
        });
    };

    const loadAllImages = async (gallery) => {
        const images = gallery.querySelectorAll("li img.media-lightbox-img");

        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.dataset.lazySrc) {
                img.src = img.dataset.lazySrc;
                img.srcset = img.dataset.lazySrcset;
                await new Promise(resolve => {
                    if (img.complete) {
                        resolve();
                    } else {
                        img.onload = resolve;
                    }
                });
            }
        }
    };

    const downloadMedia = async (postId) => {
        const post = document.getElementById(postId);
        if (!post) return alert("Error: Could not find post content");
        const mediaContainer = post.querySelector('div[slot="post-media-container"]');
        if (!mediaContainer) return alert("No media found in this post");
        const postTitle = getPostTitle(post);
        const gallery = mediaContainer.querySelector("gallery-carousel");
        const video = mediaContainer.querySelector("shreddit-player");
        let urls = [], extension = ".png";

        if (gallery) {
            await loadAllImages(gallery);
            urls = Array.from(gallery.querySelectorAll("li img.media-lightbox-img")).map(getHighestResUrl);
        } else if (video) {
            const srcUrl = video.getAttribute("src");
            const source = video.querySelector("source");

            if (srcUrl.includes("gif")) {
                urls = [source.src];
                extension = '.mp4';
            }
        } else {
            const singleImg = mediaContainer.querySelector("shreddit-aspect-ratio img.media-lightbox-img");
            if (singleImg) urls = [getHighestResUrl(singleImg)];
        }

        if (urls.length > 0) {
            await downloadQueue(urls, postTitle, extension);
            sendNotification(urls.length);
        } else {
            alert("No media found to download");
        }
    };

    const downloadQueue = async (urls, postTitle, extension) => {
        const maxConcurrent = 3, delay = 100;
        let active = 0, index = 0;

        const downloadNext = async () => {
            if (index >= urls.length) {
                return;
            }
            if (active >= maxConcurrent) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return downloadNext();
            }

            const url = urls[index];
            const filename = `${postTitle}_${index + 1}${extension}`;
            index++;
            active++;

            try {
                await downloadFile(url, filename);
            } catch (error) {
                console.error(`Error downloading ${filename}: ${error}`);
            } finally {
                active--;
                downloadNext();
            }
        };

        const promises = [];

        for (let i = 0; i < maxConcurrent; i++) {
            promises.push(downloadNext());
        }

        await Promise.all(promises);
    };

    const downloadFile = (url, filename) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
                    console.log(`Successfully downloaded: ${filename}`);
                    resolve();
                })
                .catch(error => {
                    console.error(`Error fetching ${filename}: ${error}`);
                    reject(error);
                });
        });
    };

    const init = () => {
        addButtons();
        new MutationObserver(() => addButtons()).observe(document.body, { childList: true, subtree: true });
        console.log("Reddit Image Downloader loaded");
    };

    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
