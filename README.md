# Sleep Log

A simple sleep log for students. Record when you went to bed and when you woke up, and see your average sleep at a glance.

Sleep Log is a **Progressive Web App (PWA)**: you can install it on your phone's home screen and use it like a mobile app, even without internet.

**Live app:** https://<your-username>.github.io/sleep-log/

## Features

- **Log your sleep:** pick your bedtime and wake time (date and time).
- **Duration preview:** see how long you slept before saving.
- **Average sleep:** shows your average across all saved nights (example: 7h 30m).
- **Past logs:** every saved night is listed, newest first.
- **Delete with confirmation:** a pop-up asks "Are you sure you want to delete this?" with Yes and No.
- **Form resets after saving**, while your history stays.
- **Light and dark themes:** a soft light blue theme and a purple dark theme, switched with one button.
- **Saved on your device:** logs stay after you refresh or close the page (no account or internet needed).
- **Installable mobile app (PWA):** add it to your home screen and open it full screen like a normal app.
- **Works offline:** after the first visit, it loads and saves logs without internet.
- **Mobile friendly:** the layout fits phone screens.

## Built with

- HTML5
- CSS3
- JavaScript (no frameworks)
- Web App Manifest and Service Worker (PWA)

## Install on your phone

1. Open the live app link in your phone's browser.
2. **Android (Chrome):** tap the menu (three dots), then **Install app**.
3. **iPhone (Safari):** tap **Share**, then **Add to Home Screen**.
4. Open **Sleep Log** from your home screen.

## How to install and run on a computer

1. Download or clone this repository:

   ```
   git clone https://github.com/<your-username>/sleep-log.git
   ```

2. Open the `sleep-log` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server** (install the Live Server extension if you don't have it).
   The app also opens by double-clicking `index.html`, but install and offline mode only work when it is served from a web address (Live Server or the live link).

## How to use

1. Choose your **Bedtime** and **Wake time**.
2. Check the **Duration** shown, then tap **Save**.
3. Your night appears under **Past logs** and the **Average sleep** card updates.
4. Tap **Delete** on a log, then **Yes, delete** to remove it.
5. Tap the theme button at the top to switch between light and dark.

## Project structure

```
sleep-log/
  index.html      page structure
  style.css       light and dark themes, layout
  script.js       logging, average, delete confirmation, theme switch
  manifest.json   app name, icons and colors (makes it installable)
  sw.js           service worker (offline support)
  icons/          app icons
  README.md
```

## Author

- **Name:** Pinky F. Cadiao
- **Section:** <your section>
