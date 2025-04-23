# Changelog

All notable changes to the `Reddit Download Buttons` extension will be documented in this file.

## 1.3.5 - 2025-04-22

##### Fixed

- [#7](https://github.com/956MB/reddit-download-button/issues/7) Fixed images not being downloaded at highest resolution due to incorrectly identifying the zoomable element. Downloads overall seem to be faster now with these changes (fingers crossed).
- Preview download button and others downloading from `i.redd.it` urls now uses `GM_xmlhttpRequest` (Tampermonkey only, unpacked extensions through chrome doesn't support or play nice with this) to bypass CORS.
- [#6](https://github.com/956MB/reddit-download-button/issues/6) Fixed images not having their correct extension when multiple extensions are present in the post. Like a `.gif` and a `.png`, default `.png` would be used for both.
- Not sure how or why, but maybe file previews in macOS are back to normal since we're downloading form the `i.redd.it` urls? Not even sure if this was script issue or a problem for other OS as well.

##### Removed

- Removed the installation instructions for manual "load unpacked" method. It doesn't play nice with the CORS policy of `i.redd.it` urls or the `GM_xmlhttpRequest` function used by tampermonkey. It's just not the best way to use it.
- [#2](https://github.com/956MB/reddit-download-button/issues/2) Removed the ZIP download functionality because it's broken right now and I'm not sure how to fix it. Maybe will be added back if I add UI. Reduces tampermonkey script size by ~100kb, so that's a plus. Reference to #2.

## 1.3.4 - 2025-01-08

##### Fixed

- Fixed issue where the download button wasn't being added to the post container because the classes of the div were changed. We now look for `div.shreddit-post-container` to make sure we have a place to insert the button.

## 1.3.3 - 2024-12-12

##### Fixed

- Fixed issue where single image downloads from inside gallery carousel would not work and user would get "Error: Could not find post content" or "No media found to download" alert. Caveat: Reddit seems to have a bug with the gallery carousel where it's keeping all the images as visible ("visibility: visible") when clicking forward/back. This is causing all images up to the index you've cliked to be downloaded.

## 1.3.2 - 2024-11-25

##### Added

- Added download button to the bottom bar of image preview screen. (Reached by clicking 'Open * in new tab' on an image post)

## 1.3.1 - 2024-11-23

##### Added

- Added visual indication images have downloaded in post button. Button goes from image icon and "Download Images (9)", to a checkmark and "Downloaded". The button state goes back to original when hovered and can still be used again. Right now the post download states are not saved in LocalStorage.

## 1.3 - 2024-09-28

##### Added

- Added ZIP download button for downloading all images in a post in cleaner way. (Unsure if this should be a separate button, default behaviour of the post download button, or if UI should be added to pick either option.)
- Added lightbox download button to single image carousel. The 'zoomed' image looks the same as a gallery-carousel for multiple images, but it's slightly different, so the download button wasn't being added the same as lightbox. This button functions the same as the 'Download Image' button below posts for single images.

##### Changed

- Consolidated post, lightbox and zip create button functions into one. Reduced lines.
- Removed the `sendNotification` function. The downloads should be noticable enough.
- Cleaned up filenames being used for individual images and Zip folder.

##### Fixed

- GIF posts were sometimes not recognized as single images and download button would not be created. Download button now uses text `Download GIF` for GIF posts.

## 1.2.1 - 2024-09-27

### Fixed

- Fixed issue where single image downloads from inside gallery carousel would not work. Reddit seems to have remove the `tabindex` attribute from the li elements in the gallery carousel, which was used to identify the selected image. We now check if the li has style `visibility: visible` to get the correct indexed image.

## 1.2 - 2024-09-10

### Added

- Added support for downloading single images from within the Reddit gallery carousel ("lightbox", when you click on a image and the gallery expands to fill the page).

## 1.1 - 2024-08-18

### Fixed

- Fixed posts containing video player or embedded video links incorrectly being given a download button.
- Also fixed GIF posts not being detected as a single image and download not working.
- Resolved issue where only 10 images could be downloaded from posts containing more than 10 images. Implemented batch processing with a short delay between batches to comply with Reddit's rate limiting while allowing download of all images in a post.

## 1.0 - 2024-07-25

### Added

- Initial release of the Reddit Image Downloader extension.
- Basic functionality to download images from Reddit posts.
