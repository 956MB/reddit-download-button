# Reddit Download Button

![Reddit Image and Video Downloader](./img/screenshot.png)

The browser extension that I've always wanted for Reddit... a download button for grabbing all the images within a post. It's exactly what a data hoarder needs! *Does not require Reddit login.*

>[!NOTE]
> Currently the extension doesn't work on videos due to some `m3u8` shenanigins I couldn't get to work. Please feel free to help with an [issue](https://github.com/956MB/reddit-download-button/issues) or [pull request](https://github.com/956MB/reddit-download-button/pulls).

## Features

- Adds a download button next to the share button on Reddit posts
- Supports downloading single images, image galleries, and GIFs
- Works on both the Reddit feed and individual post pages
- Detects the highest resolution version of images for download

## Supported Browsers:

>[!NOTE]
> The extension is primarily designed for Chromium-based browsers. Functionality in other browsers outside of these may be limited or require additional configuration.

##### *Chromium-based*

| Browser | Last Tested Version (Chromium Engine) |
|:--------|:--------------------------------------|
| [Arc](https://arc.net/download) | 1.49.1 (126.0.6478.127) |
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

## Changelog

### [1.1] - 2024-08-18

#### Fixed

- Fixed posts containing video player or embedded video links incorrectly being given a download button.
- Also fixed GIF posts not being detected as a single image and download not working.
- Resolved issue where only 10 images could be downloaded from posts containing more than 10 images. Implemented batch processing with a short delay between batches to comply with Reddit's rate limiting while allowing download of all images in a post.

For a full list of changes and past versions, please see the [CHANGELOG.md](CHANGELOG.md) file

## License

[MIT LICENSE](./LICENSE)
