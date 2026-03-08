# 🌄 13 Moonths — The Living Calendar

A living calendar of 13 moonths, 28 days each, aligned to the observable sky.  
Runs locally on your Mac, deploys to the web via Vercel, and installs on your iPhone as an app.

---

## Contents

- [Run locally on your Mac](#run-locally-on-your-mac)
- [Deploy to the web (GitHub + Vercel)](#deploy-to-the-web-github--vercel)
- [Install on your iPhone](#install-on-your-iphone)
- [Making changes](#making-changes)

---

## Run locally on your Mac

### Step 1 — Install Node.js (one time only)

1. Open **Safari** and go to https://nodejs.org
2. Download the **LTS** version (the left button)
3. Open the downloaded `.pkg` file and follow the installer
4. Open **Terminal** (press `Cmd + Space`, type `Terminal`, press Enter)
5. Confirm it worked by typing:
   ```
   node --version
   ```
   You should see something like `v20.11.0`

### Step 2 — Open the project in Terminal

1. In **Terminal**, navigate to this folder. If you saved it to your Desktop:
   ```
   cd ~/Desktop/moonths
   ```
   (adjust the path if you saved it somewhere else)

### Step 3 — Install dependencies (one time only)

```
npm install
```

This downloads all the required packages. Takes about 30 seconds.

### Step 4 — Start the app

```
npm run dev
```

Terminal will show something like:

```
  VITE v5.1.0  ready in 500ms
  ➜  Local:   http://localhost:5173/
```

### Step 5 — Open in Safari or Chrome

Open **Safari** and go to:
```
http://localhost:5173
```

Your calendar is now running. 🌄

### To stop the app
Press `Ctrl + C` in Terminal.

### To start it again
Just run `npm run dev` again — no need to reinstall.

---

## Deploy to the web (GitHub + Vercel)

This gives you a permanent URL you can open from any device.

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it `13-moonths`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload your project files
On the new repo page, click **uploading an existing file**  
Drag all the files from this folder into the upload area  
Click **Commit changes**

### Step 4 — Connect to Vercel
1. Go to https://vercel.com and sign up with your GitHub account (free)
2. Click **Add New Project**
3. Find and select your `13-moonths` repository
4. Vercel will auto-detect it as a Vite project — no settings to change
5. Click **Deploy**

After about 60 seconds, your calendar is live at a URL like:
```
https://13-moonths.vercel.app
```

Every time you update the files on GitHub, Vercel automatically redeploys.

---

## Install on your iPhone

Once the app is deployed on Vercel (or running locally on your Mac's network):

### From your Vercel URL
1. Open **Safari** on your iPhone
2. Go to your Vercel URL (e.g. `https://13-moonths.vercel.app`)
3. Tap the **Share** button (the box with an arrow pointing up)
4. Scroll down and tap **Add to Home Screen**
5. Name it `13 Moonths` and tap **Add**

The calendar now appears on your home screen as a full app — no browser bar, no App Store needed.

### From your Mac (local network, no internet needed)
If your Mac and iPhone are on the same Wi-Fi:
1. Start the app on your Mac with `npm run dev -- --host`
2. Terminal will show a **Network** URL like `http://192.168.1.x:5173`
3. Open that URL in Safari on your iPhone
4. Add to Home Screen as above

> **Note:** Safari is required for Add to Home Screen on iPhone. Chrome on iOS does not support this feature.

---

## Making changes

All the calendar logic and design lives in one file:
```
src/App.jsx
```

Open it in any text editor (TextEdit works, but we recommend downloading
**Visual Studio Code** — free at https://code.visualstudio.com — for a nicer experience).

Changes you might want to make:
- **Moonth names or descriptions** — find the `MOONTHS` array near the top
- **Astronomical events** — find the `ASTRO_EVENTS` array (currently 2025 data)
- **Colours** — find the `T` object (the theme)
- **Moonth symbols** — find the `symbol` field in each moonth entry

After saving your changes, the browser will automatically refresh.

---

## Project structure

```
moonths/
├── public/
│   ├── favicon.svg          ← Browser tab icon
│   └── icons/
│       ├── icon-192.png     ← PWA icon (Android)
│       ├── icon-512.png     ← PWA icon (large)
│       └── apple-touch-icon.png  ← iPhone home screen icon
├── src/
│   ├── main.jsx             ← Entry point (don't need to touch this)
│   └── App.jsx              ← ✨ The entire calendar app lives here
├── index.html               ← HTML shell
├── vite.config.js           ← Build config + PWA settings
├── package.json             ← Project dependencies
└── README.md                ← This file
```

---

Made with care. Built on the rhythm of the sky. 🌄
