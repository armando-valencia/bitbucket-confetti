# Bitbucket Confetti

A Chrome extension that celebrates your Bitbucket pull request merges with confetti!

## Features

- Automatic confetti animation when a PR is merged on Bitbucket
- Manual trigger button for already-merged PRs
- Three confetti levels: Minimal, A Lot, and A TON
- Easy-to-use settings panel
- Test button to preview confetti effects

## Installation

### Load as Unpacked Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `bitbucket-confetti` folder
5. The extension is now installed!

### Generate Icons (Optional)

Before loading the extension, you can generate proper icon files:

1. Open `icons/generate-icons.html` in your browser
2. This will automatically download three PNG files: `icon16.png`, `icon48.png`, and `icon128.png`
3. Move these files to the `icons/` directory
4. Reload the extension in Chrome

Alternatively, you can create your own icons or use any 16x16, 48x48, and 128x128 PNG files.

## Usage

### Automatic Mode
1. Visit any Bitbucket pull request page (e.g., `https://bitbucket.org/yourteam/yourrepo/pull-requests/123`)
2. When the PR is merged (while you're watching), confetti will automatically appear!

### Manual Mode (Already-Merged PRs)
If you visit a PR that's already merged, you'll see a "🎉 Celebrate!" button in the bottom-right corner. Click it to trigger confetti anytime!

### Settings
Click the extension icon to open settings and:
- Choose your preferred confetti level
- Test the confetti effect with the "Test Confetti" button

## Confetti Levels

- **Minimal**: A subtle celebration with ~50 particles
- **A Lot**: The perfect amount with ~150 particles (default)
- **A TON**: MAXIMUM CELEBRATION with ~300 particles and multiple bursts!

## Project Structure

```
bitbucket-confetti/
├── manifest.json          # Extension configuration
├── content.js            # Monitors PR pages and triggers confetti
├── popup.html            # Settings panel UI
├── popup.js              # Settings panel logic
├── popup.css             # Settings panel styles
├── lib/
│   └── canvas-confetti.js # Confetti animation library
├── icons/
│   ├── generate-icons.html # Icon generator
│   ├── icon16.png         # 16x16 extension icon
│   ├── icon48.png         # 48x48 extension icon
│   └── icon128.png        # 128x128 extension icon
└── README.md             # This file
```

## How It Works

1. **Content Script**: The `content.js` file runs on all Bitbucket PR pages
2. **DOM Monitoring**: It observes the page for merge indicators (badges, messages, etc.)
3. **Confetti Trigger**: When a merge is detected, it fires the confetti based on your settings
4. **Settings Storage**: Your preferences are saved using Chrome's sync storage API

## Troubleshooting

### Confetti not showing?

- Make sure you're on a Bitbucket pull request page (`https://bitbucket.org/*/pull-requests/*`)
- Check that the PR is actually merged (look for "Merged" badge/status)
- Open the browser console (F12) and look for "Bitbucket Confetti triggered!" message
- Try refreshing the page

### Settings not saving?

- Check that the extension has the "storage" permission
- Look for errors in the extension's popup console (right-click extension icon → "Inspect popup")

### Want to customize?

- Edit the `confettiConfigs` object in `content.js` to adjust particle counts, spread, duration, etc.
- Modify `popup.css` to change the look of the settings panel
- Update `content.js` detection logic if Bitbucket changes their UI

## Credits

- Built with [canvas-confetti](https://github.com/catdad/canvas-confetti) by catdad
- Created for Bitbucket users who love celebrating wins

## License

MIT License - Feel free to use and modify!
