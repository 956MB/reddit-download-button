<div align="center">

# Reddit Download Button

[![Greasy Fork Version](https://img.shields.io/greasyfork/v/501718?style=for-the-badge&logo=tampermonkey&logoColor=white&labelColor=4c4c4c&color=D93A00&borderRadius=8)](https://greasyfork.org/en/scripts/501718-reddit-image-downloader) [![Greasy Fork Total](https://img.shields.io/greasyfork/dt/501718?style=for-the-badge&logo=docusign&logoColor=white&label=installs&labelColor=4c4c4c&color=D93A00&borderRadius=8)](https://greasyfork.org/en/scripts/501718-reddit-image-downloader) [![Greasy Fork Daily](https://img.shields.io/greasyfork/dd/501718?style=for-the-badge&logo=addthis&logoColor=white&label=daily&labelColor=4c4c4c&color=D93A00&borderRadius=8)](https://greasyfork.org/en/scripts/501718-reddit-image-downloader) [![MIT License](https://img.shields.io/badge/License-MIT-D93A00.svg?style=for-the-badge&borderRadius=8)](https://opensource.org/licenses/MIT)

The browser extension that I've always wanted for Reddit... download buttons for easily saving images within posts. It's exactly what a data hoarder needs! *Does not require Reddit login.*

![Reddit Image and Video Downloader](./img/screenshot.png)

</div>

## Features

- Adds buttons to Reddit posts and inside galleries for easy one-click downloads
- Separate ZIP download button for downloading all images in a folder
- Supports downloading single images, entire image galleries, and GIFs
- Works on both the Reddit feed and individual post pages
- Detects the highest resolution version of images for download

>[!WARNING]
> Currently the extension doesn't work on videos due to some `m3u8` shenanigins I couldn't get to work. Please feel free to help with an [issue](https://github.com/956MB/reddit-download-button/issues) or [pull request](https://github.com/956MB/reddit-download-button/pulls).

## Supported Browsers:

##### *Chromium-based*

| Browser | Last Tested Version (Chromium Engine) |
|:--------|:--------------------------------------|
| [Arc](https://arc.net/download) | 1.63.1 (129.0.6668.90) |
| [Brave](https://brave.com/download/) | 1.67.123 (126.0.6478.126) |
| [Chrome](https://www.google.com/chrome/browser-tools/) | 126.0.6478.127 (126.0.0.0) |
| [Chromium](https://download-chromium.appspot.com/) | 128.0.6580.0 (128.0.0.0) |
| [Opera](https://www.opera.com/download) | 111.0.5168.61 (125.0.6422.143) |
| [Vivaldi](https://vivaldi.com/download/) | 6.8.3381.46 (126.0.0.0) |

##### *Other*

| Browser | Requires |
|:--------|:---------|
| [Firefox](https://www.mozilla.org/en-US/firefox/all/#product-desktop-release) | 127.0.2 |
| [Safari](https://www.apple.com/safari/) | Doesn't work natively with Safari, but the [Tampermonkey®](https://www.tampermonkey.net/index.php?browser=safari&locale=en) extension (Safari v6-11) or the paid [Mac App Store version](https://apps.apple.com/us/app/tampermonkey/id1482490089) (Safari v12+) could work. I have not tested either, though. |

## Installation

*Not added to the Chrome Web store or Firefox Add-ons yet, but may be in the future.*

##### Browser Extension (manual):

1. Clone this repository or download the [ZIP](https://github.com/956MB/reddit-download-button/releases) file and extract it
2. Open your Chromium-based browser and navigate to the extensions page (e.g., `chrome://extensions`)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the directory containing the extension files
5. The extension should now be installed and active

##### Userscript (Greasyfork/Tampermonkey):

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Click on this link to open the script in Tampermonkey: [Reddit Download Button Script](https://greasyfork.org/en/scripts/501718-reddit-image-downloader)
3. Click on the "Install" or "Update" button
4. The script should now be active on Reddit

## TODO

- [ ] Figure out downloading m3u8 videos
- [X] <s>ZIP download option for multiple images</s>
- [ ] Add UI for extension settings
- [ ] Include metadata in ZIP file for the downloaded images/post (title, author, comments, etc.)
- [ ] Support downloading multiple inline images/videos from text posts

## Changelog

[1.3](./CHANGELOG.md#13---2024-09-28) - 2024-09-28

##### Fixed

- Added ZIP download button for downloading all images in a post in cleaner way. (Unsure if this should be a separate button, default behaviour of the post download button, or if UI should be added to pick either option.)
- Added lightbox download button to single image carousel. The 'zoomed' image looks the same as a gallery-carousel for multiple images, but it's slightly different, so the download button wasn't being added the same as lightbox. This button functions the same as the 'Download Image' button below posts for single images.

##### Changed

- Consolidated post, lightbox and zip create button functions into one. Reduced lines.
- Removed the `sendNotification` function. The downloads should be noticable enough.

##### Fixed

- GIF posts were sometimes not recognized as single images and download button would not be created. Download button now uses text `Download GIF` for GIF posts.

For a full list of changes and past versions, please see the [CHANGELOG.md](CHANGELOG.md)

## License

[MIT LICENSE](./LICENSE)


