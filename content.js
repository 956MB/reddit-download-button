// ==UserScript==
// @name         Reddit Download Buttons
// @description  Adds buttons to easily download images/videos from Reddit
// @version      1.3.5
// @author       Alexander Bays (956MB)
// @namespace    https://github.com/956MB/reddit-download-button
// @match        https://*.reddit.com/*
// @match        https://*.redd.it/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    "use strict";

    const createDownloadButton = (postId, options) => {
        const {
            count = 1,
            type = 'Image',
            isLightbox = false,
            isPreview = false
        } = options;

        const btn = document.createElement("button");
        let buttonContent;

        const previewIcon = `<svg rpl="" fill="currentColor" stroke="currentColor" stroke-width="0.5" height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/></svg>`
        const lightboxIcon = `<svg rpl="" fill="currentColor" stroke="currentColor" stroke-width="1" height="26" width="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/></svg>`;
        const downloadIcon = `<svg rpl="" aria-hidden="true" class="icon-download" fill="currentColor" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M30 2.497h-28c-1.099 0-2 0.901-2 2v23.006c0 1.099 0.9 2 2 2h28c1.099 0 2-0.901 2-2v-23.006c0-1.099-0.901-2-2-2zM30 27.503l-28-0v-5.892l8.027-7.779 8.275 8.265c0.341 0.414 0.948 0.361 1.379 0.035l3.652-3.306 6.587 6.762c0.025 0.025 0.053 0.044 0.080 0.065v1.85zM30 22.806l-5.876-6.013c-0.357-0.352-0.915-0.387-1.311-0.086l-3.768 3.282-8.28-8.19c-0.177-0.214-0.432-0.344-0.709-0.363-0.275-0.010-0.547 0.080-0.749 0.27l-7.309 7.112v-14.322h28v18.309zM23 12.504c1.102 0 1.995-0.894 1.995-1.995s-0.892-1.995-1.995-1.995-1.995 0.894-1.995 1.995c0 1.101 0.892 1.995 1.995 1.995z"></path></svg>`;
        const checkIcon = `<svg rpl="" aria-hidden="true" class="icon-check" fill="currentColor" height="20" width="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><polygon points="41.6,11.1 17,35.7 6.4,25.1 3.6,28 17,42.3 44.4,13.9"/></svg>`;

        if (isPreview) {
            btn.className = "reddit-image-downloader-button-bottom-bar button border-md flex flex-row justify-center items-center h-xl font-semibold relative hidden s:block text-12 button-secondary inline-flex items-center px-sm";
            btn.setAttribute("style", "height: var(--size-button-md-h); font: var(--font-button-sm);");
        } else if (isLightbox) {
            btn.className = "reddit-image-downloader-button-lightbox absolute top-sm left-sm duration-300 opacity-100 button-large px-[var(--rem14)] button-media items-center justify-center button inline-flex";
            btn.setAttribute("aria-label", "Download image");
        } else {
            btn.className = `reddit-image-downloader-button-post button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover`;
            btn.setAttribute("style", "height: var(--size-button-sm-h); font: var(--font-button-sm)");
        }

        // btn.setAttribute("data-post-id", postId);
        btn.setAttribute("type", "button");

        if (isLightbox) {
            buttonContent = `
                <span class="flex items-center justify-center">
                    <span class="flex items-center gap-xs">
                        ${lightboxIcon}
                    </span>
                </span>
            `;
        } else if (isPreview) {
            buttonContent = `
                <span class="flex items-center">
                    <span class="flex text-20">
                        ${previewIcon}
                    </span>
                </span>
            `;
        } else {
            const text = `Download ${type}${count > 1 ? `s (${count})` : ""}`;
            buttonContent = `
                <span class="flex items-center">
                    <span class="flex text-16 mr-[var(--rem6)]">
                        ${downloadIcon}
                    </span>
                    <span>${text}</span>
                </span>
                <faceplate-screen-reader-content>${text}</faceplate-screen-reader-content>
            `;
        }

        btn.innerHTML = buttonContent;

        if (!isLightbox && !isPreview) {
            const originalText = `Download ${type}${count > 1 ? `s (${count})` : ""}`;

            btn.updateText = (text, completed = false) => {
                const textSpan = btn.querySelector('span > span:last-child');
                const iconSpan = btn.querySelector('span > span:first-child');
                const screenReaderContent = btn.querySelector('faceplate-screen-reader-content');

                if (textSpan) textSpan.textContent = text;
                if (screenReaderContent) screenReaderContent.textContent = text;
                if (completed) {
                    if (iconSpan) iconSpan.innerHTML = checkIcon;
                    const downloadedText = count > 1 ? `Downloaded (${count})` : 'Downloaded';

                    const showState = (text, icon) => {
                        textSpan.textContent = text;
                        iconSpan.innerHTML = icon;
                        screenReaderContent.textContent = text;
                    };

                    btn.addEventListener('mouseenter', () => showState(originalText, downloadIcon));
                    btn.addEventListener('mouseleave', () => showState(downloadedText, checkIcon));
                }
            };
        }

        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.disabled = true;
            await downloadMedia(postId, isLightbox, btn);
            btn.disabled = false;
        });

        return btn;
    };

    const addPostButtons = () => {
        document.querySelectorAll("shreddit-post").forEach((post) => {
            const postId = post.id, shadowRoot = post.shadowRoot;
            if (!shadowRoot) return;

            let postContainer = shadowRoot.querySelector("div.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start");
            if (!postContainer) {
                postContainer = shadowRoot.querySelector("div.shreddit-post-container");
                if (!postContainer) return;
                if (postContainer.querySelector(".reddit-image-downloader-button-post")) return;
            } else {
                if (postContainer.querySelector(".reddit-image-downloader-button-post")) return;
            }

            const mediaContainer = post.querySelector('div[slot="post-media-container"]');
            if (!mediaContainer) return;

            const embed = mediaContainer.querySelector("shreddit-embed");
            if (embed) return;

            let count = 1;
            const gallery = mediaContainer.querySelector("gallery-carousel");
            const video = mediaContainer.querySelector("shreddit-player, shreddit-player-2");
            const src = video?.querySelector("source")?.src;
            const isGif = src?.includes("gif");

            if (gallery) {
                count = mediaContainer.querySelectorAll("gallery-carousel ul li").length;
            }
            if ((video && ((src?.includes("mp4") && !isGif) || src?.includes("m3u8"))) || count === 0) return;

            const buttons = [createDownloadButton(postId, { count, type: isGif ? 'GIF' : 'Image' })];

            const insertAfter = (targetElement) => { buttons.reverse().forEach(button => targetElement.insertAdjacentElement("afterend", button)) };
            const shareBtn = postContainer.querySelector('slot[name="share-button"]');

            if (shareBtn) {
                insertAfter(shareBtn);
            } else {
                const awardBtn = postContainer.querySelector("award-button")?.nextElementSibling?.nextElementSibling;
                if (awardBtn) {
                    insertAfter(awardBtn);
                } else {
                    return;
                }
            }
        });
    };

    const addLightboxButton = () => {
        const lightbox = document.getElementById("shreddit-media-lightbox");
        if (!lightbox) return;
        if (lightbox.querySelector(".reddit-image-downloader-button-lightbox")) return;

        const closeButton = lightbox.querySelector('button[aria-label="Close lightbox"]');
        if (!closeButton) return;

        const lightboxButton = createDownloadButton(null, { isLightbox: true });
        closeButton.parentNode.insertBefore(lightboxButton, closeButton);
    };

    const addPreviewButton = () => {
        const bottomBar = document.querySelector("post-bottom-bar");
        if (!bottomBar) return;
        const shadowRoot = bottomBar.shadowRoot;
        if (!shadowRoot) return;

        const buttonContainer = shadowRoot.querySelector('div.flex.flex-row.gap-\\[1rem\\].items-center');
        if (!buttonContainer) return;
        if (buttonContainer.querySelector(".reddit-image-downloader-button-bottom-bar")) return;

        const downloadButton = createDownloadButton(bottomBar.getAttribute("permalink"), {
            count: 1,
            type: 'Image',
            isPreview: true
        });
        const firstLink = buttonContainer.querySelector('a');
        if (firstLink) {
            buttonContainer.insertBefore(downloadButton, firstLink);
        }
    };

    const addButtons = () => {
        addPostButtons();
        addLightboxButton();
        addPreviewButton();
    };

    const getPostTitle = (element) => {
        if (element instanceof HTMLImageElement) {
            const parts = element.alt.split(" - ");
            return parts.length > 1 ? parts[1].trim() : parts[0].trim();
        }

        const title = element.querySelector('h1[id^="post-title-"]')?.textContent.trim() ||
            element.getAttribute("post-title") ||
            "Untitled";
        return title;
    };

    const getHighestResUrl = (img) => {
        const mediaLightbox = img.closest(".media-lightbox-img");
        const zoomable = mediaLightbox?.parentElement?.querySelector(".zoomable-img-wrapper img");
        if (zoomable) return zoomable.src;
        const srcset = img.getAttribute("srcset");

        if (srcset) {
            const sources = srcset.split(",").map((src) => {
                const [url, width] = src.trim().split(" ");
                return { url, width: parseInt(width) };
            }).sort((a, b) => b.width - a.width);
            
            if (sources.length > 0) {
                console.log("Using highest res from srcset:", sources[0].url);
                return sources[0].url;
            }
        }
        
        console.log("Falling back to original src:", img.src);
        return img.src;
    };

    const loadAllImages = async (container) => {
        if (container.tagName === 'gallery-carousel') {
            const galleryImages = container.querySelectorAll("li img.media-lightbox-img");
            
            for (let i = 0; i < galleryImages.length; i++) {
                const img = galleryImages[i];
                if (img.dataset.lazySrc) {
                    img.src = img.dataset.lazySrc;
                    img.srcset = img.dataset.lazySrcset;
                }
                if (!img.complete) {
                    await new Promise(resolve => {
                        img.onload = resolve;
                        setTimeout(resolve, 3000);
                    });
                }
            }
        } 
        else if (container instanceof HTMLImageElement) {
            const img = container;
            const mediaLightbox = img.closest(".media-lightbox-img");
            
            if (mediaLightbox) {
                const zoomableWrapper = mediaLightbox.querySelector(".zoomable-img-wrapper");
                
                if (zoomableWrapper) {
                    zoomableWrapper.classList.remove("hidden");
                    await new Promise(resolve => setTimeout(resolve, 100));
                    const zoomableImg = zoomableWrapper.querySelector("zoomable-img img");
                    if (zoomableImg && !zoomableImg.complete) {
                        await new Promise(resolve => {
                            zoomableImg.onload = resolve;
                            setTimeout(resolve, 3000);
                        });
                    }
                }
            }
        }
    };

    const getExtensionFromUrl = (url, fallbackExt) => {
        if (url.includes('i.redd.it')) {
            const directMatch = url.match(/i\.redd\.it\/[^.]+\.(gif|png|jpe?g)/i);
            if (directMatch) {
                return `.${directMatch[1].toLowerCase()}`;
            }
        }
        
        const ext = url.match(/\.(gif|png|jpe?g)(?:\?|$)/i);
        return ext ? `.${ext[1].toLowerCase()}` : fallbackExt;
    };

    const downloadMedia = async (postId, isLightbox, btn = null) => {
        let post = null, mediaContainer = null, lightbox = null, gallery = null, video = null;
        let urls = [], indexes = [], extension = ".png";

        if (postId && postId.startsWith('/r/')) {
            const content = document.querySelector('faceplate-tracker zoomable-img img') ||
                document.querySelector('faceplate-tracker zoomable-img video');

            if (content) {
                const urls = [content.src];
                const titleMatch = postId.match(/\/([^/]+)\/$/);
                const postTitle = titleMatch ? titleMatch[1] : "untitled";
                const extension = (content.tagName === 'VIDEO') ? '.mp4' : '.png';

                await downloadQueue(urls, [], postTitle, extension, false, btn);
                return;
            }
        }

        if (!isLightbox) {
            post = document.getElementById(postId);
            console.log("postId: ", postId);
            if (!post) return alert("Error: Could not find post content");
            mediaContainer = post.querySelector('div[slot="post-media-container"]');
            if (!mediaContainer) return alert("No media found in this post");
            gallery = mediaContainer.querySelector("gallery-carousel");
            video = mediaContainer.querySelector("shreddit-player, shreddit-player-2");
        } else {
            lightbox = document.getElementById("shreddit-media-lightbox");
            gallery = lightbox.querySelector("gallery-carousel");
            if (gallery) {
                postId = gallery.getAttribute("post-id");
                post = document.getElementById(postId);
            }
        }

        if (gallery) {
            await loadAllImages(gallery);
            if (isLightbox) {
                gallery.querySelectorAll("li").forEach((li, index) => {
                    if (li.style.visibility === "visible" || li.getAttribute('tabindex') === "0") {
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
            console.log("no gallery or video, SINGLE IMAGE");
            let singleImg = null;
            if (isLightbox && lightbox) {
                console.log("lightbox: ", lightbox);
                singleImg = lightbox.querySelector("img.media-lightbox-img");
            } else {
                singleImg = mediaContainer.querySelector("shreddit-aspect-ratio img.media-lightbox-img");
            }
            if (singleImg) {
                await loadAllImages(singleImg);
                urls = [getHighestResUrl(singleImg)];
            }
            post = singleImg;
        }

        if (urls.length > 0) {
            const postTitle = getPostTitle(post);
            await downloadQueue(urls, indexes, postTitle, extension, isLightbox, btn);
        } else {
            alert("No media found to download");
            if (btn?.updateText) {
                btn.updateText('Download failed');
            }
        }
    };

    const downloadQueue = async (urls, indexes, postTitle, fallbackExt, isLightbox, btn = null) => {
        const cleanTitle = postTitle.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
        const batchSize = 10, baseDelay = 10000, randomDelay = 2000, totalImages = urls.length;
        let downloadedCount = 0;

        const updateButtonStatus = () => {
            if (btn?.updateText) {
                if (totalImages > batchSize) {
                    btn.updateText(`Downloading ${downloadedCount}/${totalImages}...`);
                }
            }
        };

        const downloadBatch = async (batch, batchIndexes) => {
            const promises = batch.map(async (url, index) => {
                const extension = getExtensionFromUrl(url, fallbackExt);
                const filename = isLightbox && indexes.length > 0
                    ? `${cleanTitle}_${batchIndexes[index]}${extension}`
                    : `${cleanTitle}_${downloadedCount + index + 1}${extension}`;
                try {
                    // Use GM_xmlhttpRequest for i.redd.it urls to bypass cors (works in Tampermonkey)
                    if (url.includes('i.redd.it') && typeof GM_xmlhttpRequest !== 'undefined') {
                        return new Promise((resolve) => {
                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: url,
                                responseType: 'blob',
                                onload: async function (response) {
                                    try {
                                        const blob = response.response;
                                        await saveBlob(blob, filename);
                                        console.log(`Downloaded: ${filename}`);
                                        resolve(true);
                                    } catch (error) {
                                        console.error(`Error processing ${filename}: ${error}`);
                                        resolve(false);
                                    }
                                },
                                onerror: function (error) {
                                    console.error(`Error downloading ${filename}: ${error}`);
                                    resolve(false);
                                }
                            });
                        });
                    } else {
                        // Regular fetch for non-i.redd.it URLs
                        const response = await fetch(url, { mode: 'cors' });
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const blob = await response.blob();
                        await saveBlob(blob, filename);
                        console.log(`Downloaded: ${filename}`);
                        return true;
                    }
                } catch (error) {
                    console.error(`Error processing ${filename}: ${error}`);
                    return false;
                }
            });

            const results = await Promise.all(promises);
            downloadedCount += results.filter(Boolean).length;
            updateButtonStatus();

            if (totalImages > 1) {
                console.log(`Batch complete. Processed: ${downloadedCount}/${totalImages}`);
            }
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

        if (btn?.updateText) {
            const completionText = totalImages > 1 ? `Downloaded (${totalImages})` : 'Downloaded';
            btn.updateText(completionText, true);
        }

        if (totalImages > 1) {
            console.log(`Download queue completed for "${postTitle}". Total files: ${downloadedCount}`);
        }
    };

    const saveBlob = async (blob, filename) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    };

    const init = () => {
        console.log(`Reddit Image Downloader v1.3.5 Init`);
        console.log("- https://github.com/956MB/reddit-download-button");
        addButtons();
        new MutationObserver(() => addButtons()).observe(document.body, { childList: true, subtree: true });
    };

    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
