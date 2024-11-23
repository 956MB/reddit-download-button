# Changelog

All notable changes to the Reddit Image Downloader extension will be documented in this file.

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
