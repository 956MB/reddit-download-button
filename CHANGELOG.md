# Changelog

All notable changes to the Reddit Image Downloader extension will be documented in this file.

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
