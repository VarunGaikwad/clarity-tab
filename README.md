# Clarity Chrome Extension README

## Introduction

**Clarity** is a personalized Chrome extension that transforms your new tab page into a beautifully customized and functional space. Designed specifically for personal use, Clarity brings together your favorite websites, a powerful search bar, and unique features to enhance your browsing experience.

## Features

- **Favorite Websites**: Quick access to your favorite websites with their icons displayed prominently.
- **DuckDuckGo Search Bar**: Easily search the web with DuckDuckGo directly from your new tab.
- **Percentage Clock**: Displays the current time as a percentage of the day.
- **Binary Clock**: Toggle to a binary clock for a more unique time display.
- **Greeting of the Day**: A personalized greeting including your name and a Japanese word of the day.
- **Dynamic Background**: Beautiful background images fetched from the Unsplash API.

## Getting Started

### Prerequisites

- Google Chrome browser
- Basic understanding of installing Chrome extensions

### Installation

1. **Download the Clarity Extension**:

   - Clone or download the Clarity extension repository from your personal storage.

2. **Unpack the Extension**:

   - Unzip the downloaded file if necessary.

3. **Load the Extension in Chrome**:

   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" by toggling the switch in the top right corner.
   - Click on the "Load unpacked" button and select the folder containing the Clarity extension files.

4. **Set Up Your Favorite Websites**:
   - Edit the `links.json` file in the extension folder to include your favorite websites and their icons.

### Using Clarity

1. **Open a New Tab**:
   - Each new tab will display your favorite websites, the DuckDuckGo search bar, the current time, and the personalized greeting.
2. **Toggle Clocks**:
   - Click the clock icon to switch between the percentage clock and the binary clock.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript for building the user interface.
- **APIs**:
  - Unsplash API for fetching dynamic background images.
  - DuckDuckGo for the search functionality.

## Customization

Clarity is highly customizable to suit your personal preferences. Here are some of the customization options:

1. **Favorite Websites**:

   - Modify the `links.json` file to add, remove, or change the websites and icons.

   ```json
   [
     {
       "name": "Google",
       "url": "https://www.google.com"
     },
     {
       "name": "GitHub",
       "url": "https://www.github.com"
     }
   ]
   ```

2. **Background Images**:

   - The background images are fetched from Unsplash. You can modify the API settings or keywords in the extension's JavaScript files to change the type of images displayed.

3. **Greeting and Japanese Word of the Day**:
   - Customize the greeting message and the source of the Japanese words by editing the relevant JavaScript functions in the extension files.

## Background Image License

- The background images used in Clarity are fetched from the Unsplash API and are subject to the Unsplash License.

## Contact

For any questions or suggestions, feel free to reach out to me at:

- **Email**: gaikwadvarun23@gmail.com
- **LinkedIn**: [Varun Gaikwad](https://www.linkedin.com/in/varun-gaikwad/)

Thank you for using Clarity! I hope it enhances your browsing experience with a touch of personalization.
