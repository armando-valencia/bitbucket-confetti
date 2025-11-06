# Bitbucket Confetti

look, merging PRs should feel like a victory. this extension makes that happen with an unreasonable amount of confetti.

## what does it do

- throws confetti at your screen when you merge a PR (automatically, like magic)
- adds a little "party time" button on already-merged PRs for when you want to relive the glory
- lets you pick how extra you want to be (4 levels of chaos)
- has a test button so you can yeet confetti whenever you want
- works on Bitbucket because apparently that's what you use

## how to install this thing

### the actual steps

1. go to `chrome://extensions/` in your browser
2. flip on "Developer mode" (top right, can't miss it)
3. click "Load unpacked"
4. point it at the `bitbucket-confetti` folder
5. boom, you got confetti

### icons (if you care)

the extension needs icons but honestly just use whatever. if you want the fancy auto-generated ones:

1. open `icons/generate-icons.html` in your browser
2. it'll download 3 PNG files
3. shove them in the `icons/` folder
4. reload the extension

or just make your own. 16x16, 48x48, and 128x128 pixels. go wild.

## how to use it

### it just works (automatic mode)
1. open a PR on Bitbucket
2. merge it
3. confetti happens
4. feel good about yourself

### manual mode (for the nostalgic)
already merged a PR? there's a "🎉 party time" button in the bottom right. click it. you know you want to.

### settings (for the control freaks)
click the extension icon to mess with stuff:
- pick your chaos level
- test it before committing to the bit

## the chaos levels explained

- **barely trying**: ~50 particles. for people who hate fun.
- **respectfully extra**: ~150 particles. this is the default because we have taste.
- **AGGRESSIVELY FESTIVE**: ~300 particles for 3 seconds. your coworkers WILL ask questions.
- **UNHINGED**: 10 full seconds of confetti from every direction. screen coverage: yes. regrets: none.

## what's in here

```
bitbucket-confetti/
├── manifest.json          # chrome extension stuff
├── content.js            # the script that stalks your PR and throws confetti
├── popup.html            # settings UI (it's pretty)
├── popup.js              # settings logic
├── popup.css             # makes it not look like garbage
├── lib/
│   └── canvas-confetti.js # the actual confetti magic (not ours)
├── icons/
│   └── generate-icons.html # makes icons if you're lazy
└── README.md             # you're reading it
```

## how does it work tho

1. **content.js** runs on every Bitbucket PR page you visit
2. it watches for the "Merged" badge like a hawk
3. when it spots a merge, it yeets confetti at your screen
4. your settings live in Chrome's sync storage so they follow you around

## something broke

### no confetti showing up?
- are you on an actual PR page? (`https://bitbucket.org/whatever/pull-requests/123`)
- is it actually merged? check for the merge badge
- open console (F12) and look for errors or the "Bitbucket Confetti triggered!" message
- try refreshing the page
- reload the extension

### settings won't save?
- check if the extension has storage permission (it should)
- right-click the extension icon → "Inspect popup" and look for errors
- worst case: uninstall and reinstall

### wanna tweak the code?
- confetti settings live in the `confettiConfigs` object in `content.js`
- popup styling is in `popup.css`
- if Bitbucket changes their UI and breaks detection, update the selectors in `content.js`

## credit where it's due

- uses [canvas-confetti](https://github.com/catdad/canvas-confetti) by catdad (they're the real MVP)
- made by someone who was tired of PRs feeling like mundane tasks

## license

MIT - do whatever you want with it. copy it, break it, make it worse. we're not your parents.
