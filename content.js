// ==UserScript==
// @name         Reddit Image Download Button
// @description  Adds a button to download images from Reddit posts
// @version      1.2
// @author       Alexander Bays (956MB)
// @namespace    https://github.com/956MB/reddit-download-button
// @match        https://*.reddit.com/*
// @match        https://*.redd.it/*
// @license      MIT
// ==/UserScript==

(function () {
    "use strict";

    const createPostDownloadButton = (postId, count, type) => {
        const btn = document.createElement("button");
        btn.className = "reddit-image-downloader-button-post button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover";
        btn.setAttribute("rpl", "");
        btn.setAttribute("data-post-click-location", "download-button");
        btn.setAttribute("data-post-id", postId);
        btn.setAttribute("style", "height: var(--size-button-sm-h); font: var(--font-button-sm)");
        btn.setAttribute("type", "button");

        const text = `Download ${type}${count > 1 ? `s (${count})` : ""}`;
        btn.innerHTML = `
            <span class="flex items-center">
                <span class="flex text-16 mr-[var(--rem6)]">
                    <svg rpl="" aria-hidden="true" class="icon-download" fill="currentColor" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M30 2.497h-28c-1.099 0-2 0.901-2 2v23.006c0 1.099 0.9 2 2 2h28c1.099 0 2-0.901 2-2v-23.006c0-1.099-0.901-2-2-2zM30 27.503l-28-0v-5.892l8.027-7.779 8.275 8.265c0.341 0.414 0.948 0.361 1.379 0.035l3.652-3.306 6.587 6.762c0.025 0.025 0.053 0.044 0.080 0.065v1.85zM30 22.806l-5.876-6.013c-0.357-0.352-0.915-0.387-1.311-0.086l-3.768 3.282-8.28-8.19c-0.177-0.214-0.432-0.344-0.709-0.363-0.275-0.010-0.547 0.080-0.749 0.27l-7.309 7.112v-14.322h28v18.309zM23 12.504c1.102 0 1.995-0.894 1.995-1.995s-0.892-1.995-1.995-1.995-1.995 0.894-1.995 1.995c0 1.101 0.892 1.995 1.995 1.995z"></path>
                    </svg>
                </span>
                <span>${text}</span>
            </span>
            <faceplate-screen-reader-content>${text}</faceplate-screen-reader-content>
        `;

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadMedia(postId, false);
        });

        return btn;
    };

    const createLightboxDownloadButton = (postId) => {
        const btn = document.createElement("button");
        btn.className = "reddit-image-downloader-button-lightbox absolute top-sm left-sm duration-300 opacity-100 button-large px-[var(--rem14)] button-media items-center justify-center button inline-flex";
        btn.setAttribute("rpl", "");
        btn.setAttribute("aria-label", "Download image");
        btn.setAttribute("data-testid", "download-button");
        btn.setAttribute("data-post-id", postId);

        btn.innerHTML = `
            <span class="flex items-center justify-center">
                <span class="flex items-center gap-xs">
                    <svg rpl="" fill="currentColor" stroke="currentColor" stroke-width="1" height="26" width="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/>
                    </svg>
                </span>
            </span>
        `;

        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            downloadMedia(postId, true);
        });

        return btn;
    };

    const addPostButtons = () => {
        document.querySelectorAll("shreddit-post").forEach((post) => {
            const postId = post.id, shadowRoot = post.shadowRoot;
            if (!shadowRoot) return;
            const targetDiv = shadowRoot.querySelector("div.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start");
            if (!targetDiv || targetDiv.querySelector(".reddit-image-downloader-button-post")) return;
            const mediaContainer = post.querySelector('div[slot="post-media-container"]');
            if (!mediaContainer) return;

            const embed = mediaContainer.querySelector("shreddit-embed");
            if (embed) return;

            let count = 1, type = "Image";
            const gallery = mediaContainer.querySelector("gallery-carousel");
            const video = mediaContainer.querySelector("shreddit-player, shreddit-player-2");
            const src = video?.querySelector("source")?.src;

            if (gallery) {
                count = mediaContainer.querySelectorAll("gallery-carousel ul li").length;
            }
            if (video && ((src?.includes("mp4") && !src?.includes("gif")) || src?.includes("m3u8"))) return;
            if (count === 0) return;

            const shareBtn = targetDiv.querySelector('slot[name="share-button"]');
            const downloadAllBtn = createPostDownloadButton(postId, count, type);

            if (shareBtn) {
                shareBtn.insertAdjacentElement("afterend", downloadAllBtn);
            } else {
                const awardBtn = targetDiv.querySelector("award-button");

                if (awardBtn && awardBtn.nextElementSibling?.nextElementSibling) {
                    awardBtn.nextElementSibling.nextElementSibling.insertAdjacentElement("afterend", downloadAllBtn);
                }
            }
        });
    };

    const addLightboxButton = () => {
        const lightbox = document.getElementById("shreddit-media-lightbox");
        if (!lightbox || lightbox.querySelector(".reddit-image-downloader-button-lightbox")) return;
        const closeButton = lightbox.querySelector('button[aria-label="Close lightbox"]');
        if (!closeButton) return;
        const postId = lightbox.querySelector("gallery-carousel")?.getAttribute("post-id");
        if (!postId) return;

        const downloadButton = createLightboxDownloadButton(postId);
        closeButton.parentNode.insertBefore(downloadButton, closeButton);
    };

    const addButtons = () => {
        addPostButtons();
        addLightboxButton();
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

    const downloadMedia = async (postId, isLightbox) => {
        const post = document.getElementById(postId);
        if (!post) return alert("Error: Could not find post content");
        const mediaContainer = post.querySelector('div[slot="post-media-container"]');
        if (!mediaContainer) return alert("No media found in this post");
        let gallery = mediaContainer.querySelector("gallery-carousel");
        const video = mediaContainer.querySelector("shreddit-player, shreddit-player-2");
        let urls = [], indexes = [], extension = ".png";

        if (isLightbox) {
            const lightbox = document.getElementById("shreddit-media-lightbox");
            gallery = lightbox.querySelector("gallery-carousel");
        }

        if (gallery) {
            await loadAllImages(gallery);
            if (isLightbox) {
                gallery.querySelectorAll("li").forEach((li, index) => {
                    if (li.getAttribute('tabindex') === "0") {
                        const img = li.querySelector("img.media-lightbox-img");
                        if (img) {
                            urls.push(getHighestResUrl(img));
                            const slot = li.getAttribute("slot");
                            const pageNumber = slot ? parseInt(slot.replace("page-", "")) : index + 1;
                            indexes.push(pageNumber);
                        }
                    }
                });
            } else {
                urls = Array.from(gallery.querySelectorAll("li img.media-lightbox-img")).map(getHighestResUrl);
            }
        } else if (video) {
            const srcUrl = video.getAttribute("src"), source = video.querySelector("source");
            if (srcUrl.includes("gif")) {
                urls = [source.src];
                extension = '.mp4';
            }
        } else {
            const singleImg = mediaContainer.querySelector("shreddit-aspect-ratio img.media-lightbox-img");
            if (singleImg) urls = [getHighestResUrl(singleImg)];
        }

        if (urls.length > 0) {
            const postTitle = getPostTitle(post);
            await downloadQueue(urls, indexes, postTitle, extension, isLightbox);
            sendNotification(urls.length);
        } else {
            alert("No media found to download");
        }
    };

    const downloadQueue = async (urls, indexes, postTitle, extension, isLightbox) => {
        const batchSize = 10, baseDelay = 10000, randomDelay = 2000, totalImages = urls.length;
        let downloadedCount = 0;

        const downloadBatch = async (batch, batchIndexes) => {
            const promises = batch.map(async (url, index) => {
                const filename = isLightbox && indexes.length > 0
                    ? `${postTitle}_${batchIndexes[index]}${extension}`
                    : `${postTitle}_${downloadedCount + index + 1}${extension}`;
                try {
                    await downloadFile(url, filename);
                    console.log(`Successfully downloaded: ${filename}`);
                    return true;
                } catch (error) {
                    console.error(`Error downloading ${filename}: ${error}`);
                    return false;
                }
            });

            const results = await Promise.all(promises);
            downloadedCount += results.filter(Boolean).length;
            if (urls.length > 1) { console.log(`Batch complete. Downloaded: ${downloadedCount}/${totalImages}`); }
        };

        for (let i = 0; i < urls.length; i += batchSize) {
            const batch = urls.slice(i, i + batchSize), batchIndexes = indexes.slice(i, i + batchSize);
            await downloadBatch(batch, batchIndexes);
            if (i + batchSize < urls.length) {
                const delay = baseDelay + Math.random() * randomDelay;
                console.log(`Waiting ${Math.floor(delay / 1000)} seconds before next batch...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        if (urls.length > 1) { console.log(`All downloads complete. Total: ${totalImages}`); }
    };

    const downloadFile = (url, filename) => {
        return new Promise((resolve, reject) => {
            fetch(url, { mode: 'cors' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(a.href);
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
