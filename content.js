// ==UserScript==
// @name         Reddit Download Buttons
// @description  Adds buttons to easily download images/videos from Reddit
// @version      1.3.3
// @author       Alexander Bays (956MB)
// @namespace    https://github.com/956MB/reddit-download-button
// @match        https://*.reddit.com/*
// @match        https://*.redd.it/*
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// ==/UserScript==

(function () {
    "use strict";

    const createDownloadButton = (postId, options) => {
        const {
            count = 1,
            type = 'Image',
            isZip = false,
            isLightbox = false,
            isPreview = false
        } = options;

        const btn = document.createElement("button");
        let buttonContent;

        const previewIcon = `<svg rpl="" fill="currentColor" stroke="currentColor" stroke-width="0.5" height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/></svg>`
        const lightboxIcon = `<svg rpl="" fill="currentColor" stroke="currentColor" stroke-width="1" height="26" width="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.97 11.03a.75.75 0 111.06-1.06L11 14.94V2.75a.75.75 0 011.5 0v12.19l4.97-4.97a.75.75 0 111.06 1.06l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25zm-.22 9.47a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H4.75z"/></svg>`;
        const zipIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.005 2.73l-1.726-.999.996-1.731 1.725.999-.995 1.731zm-.87 1.669l-1.809-.678-.681 1.88 1.808.677.682-1.879zm-1.148 3.601h-1.987v2h1.987v-2zm-8.987-7.001l1.725-.999.996 1.731-1.726.999-.995-1.731zm2.547 5.28l1.808-.677-.681-1.88-1.809.677.682 1.88zm.466 3.721h1.987v-2h-1.987v2zm7.837 9l-1.852-7h-5.996l-1.852 7c-.786 3.156 1.602 5 4.85 5 3.252 0 5.635-1.848 4.85-5zm-7.848 1.125c0-2.627 5.992-2.688 5.992-.007 0 2.555-5.992 2.536-5.992.007z"/></svg>`;
        const downloadIcon = `<svg rpl="" aria-hidden="true" class="icon-download" fill="currentColor" height="20" width="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M30 2.497h-28c-1.099 0-2 0.901-2 2v23.006c0 1.099 0.9 2 2 2h28c1.099 0 2-0.901 2-2v-23.006c0-1.099-0.901-2-2-2zM30 27.503l-28-0v-5.892l8.027-7.779 8.275 8.265c0.341 0.414 0.948 0.361 1.379 0.035l3.652-3.306 6.587 6.762c0.025 0.025 0.053 0.044 0.080 0.065v1.85zM30 22.806l-5.876-6.013c-0.357-0.352-0.915-0.387-1.311-0.086l-3.768 3.282-8.28-8.19c-0.177-0.214-0.432-0.344-0.709-0.363-0.275-0.010-0.547 0.080-0.749 0.27l-7.309 7.112v-14.322h28v18.309zM23 12.504c1.102 0 1.995-0.894 1.995-1.995s-0.892-1.995-1.995-1.995-1.995 0.894-1.995 1.995c0 1.101 0.892 1.995 1.995 1.995z"></path></svg>`;
        const checkIcon = `<svg rpl="" aria-hidden="true" class="icon-check" fill="currentColor" height="20" width="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><polygon points="41.6,11.1 17,35.7 6.4,25.1 3.6,28 17,42.3 44.4,13.9"/></svg>`;

        if (isPreview) {
            btn.className = "reddit-image-downloader-button-bottom-bar button border-md flex flex-row justify-center items-center h-xl font-semibold relative hidden s:block text-12 button-secondary inline-flex items-center px-sm";
            btn.setAttribute("style", "height: var(--size-button-md-h); font: var(--font-button-sm);");
        } else if (isLightbox) {
            btn.className = "reddit-image-downloader-button-lightbox absolute top-sm left-sm duration-300 opacity-100 button-large px-[var(--rem14)] button-media items-center justify-center button inline-flex";
            btn.setAttribute("aria-label", "Download image");
        } else {
            btn.className = `reddit-image-downloader-button-${isZip ? 'zip' : 'post'} button border-md flex flex-row justify-center items-center h-xl font-semibold relative text-12 button-secondary inline-flex items-center px-sm hover:text-secondary hover:bg-secondary-background-hover hover:border-secondary-background-hover`;
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
        } else if (isZip) {
            buttonContent = `
                <span class="flex items-center justify-center">
                    ${zipIcon}
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

        if (!isLightbox && !isZip && !isPreview) {
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
            await downloadMedia(postId, isLightbox, isZip, btn);
            btn.disabled = false;
        });

        return btn;
    };

    const addPostButtons = () => {
        document.querySelectorAll("shreddit-post").forEach((post) => {
            const postId = post.id, shadowRoot = post.shadowRoot;
            if (!shadowRoot) return;

            const targetDiv = shadowRoot.querySelector("div.flex.flex-row.items-center.flex-nowrap.overflow-hidden.justify-start");
            if (!targetDiv) return;
            if (targetDiv.querySelector(".reddit-image-downloader-button-post")) return;

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
            if (count >= 2) {
                buttons.push(createDownloadButton(postId, { isZip: true }));
            }

            const insertAfter = (targetElement) => { buttons.reverse().forEach(button => targetElement.insertAdjacentElement("afterend", button)) };
            const shareBtn = targetDiv.querySelector('slot[name="share-button"]');

            if (shareBtn) {
                insertAfter(shareBtn);
            } else {
                const awardBtn = targetDiv.querySelector("award-button")?.nextElementSibling?.nextElementSibling;
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

    const downloadMedia = async (postId, isLightbox, asZip = false, btn = null) => {
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
                
                await downloadQueue(urls, [], postTitle, extension, false, false, btn);
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
                    // BUG: (with Reddit NOT code) For some reason the gallery-carousel on Reddit is keeping all the images as visible ("visibility: visible") when clicking forward/back. This is causing all images up to the index you've cliked to be downloaded.
                    // Only other method I can see right now of knowing the index is the translate3d value of the gallery-carousel. It's going up/down based on the window width.
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
            if (singleImg) urls = [getHighestResUrl(singleImg)];
            post = singleImg;
        }

        if (urls.length > 0) {
            const postTitle = getPostTitle(post);
            await downloadQueue(urls, indexes, postTitle, extension, isLightbox, asZip, btn);
        } else {
            alert("No media found to download");
            if (btn?.updateText) {
                btn.updateText('Download failed');
            }
        }
    };

    const downloadQueue = async (urls, indexes, postTitle, extension, isLightbox, asZip = false, btn = null) => {
        const cleanTitle = postTitle.replace(/[^a-z0-9]/gi, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
        const batchSize = 10, baseDelay = 10000, randomDelay = 2000, totalImages = urls.length;
        let downloadedCount = 0;

        let zip = null;
        if (asZip) {
            zip = new JSZip();
        }

        const updateButtonStatus = () => {
            if (btn?.updateText) {
                if (totalImages > batchSize) {
                    btn.updateText(`Downloading ${downloadedCount}/${totalImages}...`);
                }
            }
        };

        const downloadBatch = async (batch, batchIndexes) => {
            const promises = batch.map(async (url, index) => {
                const filename = isLightbox && indexes.length > 0
                    ? `${cleanTitle}_${batchIndexes[index]}${extension}`
                    : `${cleanTitle}_${downloadedCount + index + 1}${extension}`;
                try {
                    const response = await fetch(url, { mode: 'cors' });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const blob = await response.blob();
                    if (asZip) {
                        zip.file(filename, blob);
                    } else {
                        await saveBlob(blob, filename);
                    }
                    console.log(`${asZip ? "Added to zip" : "Downloaded"}: ${filename}`);
                    return true;
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


        if (asZip && downloadedCount > 0) {
            console.log(`Generating zip file...`);

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const sanitizeName = postTitle.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/^\.+/, '').replace(/\.+$/, '').replace(/\.+/g, '.').trim();
            const zipFilename = `${sanitizeName}.zip`;
            await saveBlob(zipBlob, zipFilename);

            console.log(`Zip file downloaded: ${zipFilename}`);
        }

        if (btn?.updateText) {
            const completionText = totalImages > 1 ? `Downloaded (${totalImages})` : 'Downloaded';
            btn.updateText(completionText, true);
        }

        if (!asZip && totalImages > 1) {
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
        console.log(`Reddit Image Downloader v1.3.3 Init`);
        console.log("- https://github.com/956MB/reddit-download-button");
        addButtons();
        new MutationObserver(() => addButtons()).observe(document.body, { childList: true, subtree: true });
    };

    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init) : init();
})();
