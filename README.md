# Digital vCard

A digital business card for Bala Mahesh B.

- **Website** (repo root): Vite, React, TypeScript, Tailwind CSS v4. Live at https://digital-vcard-omega.vercel.app
- **Mobile app** (`mobile/`): Expo + React Native for Android and iOS. See [mobile/README.md](mobile/README.md)
- **Shared** (`shared/`): card details and the vCard builder, used by both

## Website

- **Save contact**: downloads a `.vcf` file that phones import straight into Contacts
- **Scan to save**: the QR code holds the full vCard, so scanning adds the contact without any internet. Switch it to **Card page** to share the site link instead, and tap the code to show it full screen
- **Share**: opens the phone's share sheet, or copies the link on desktop
- Copy buttons on every contact row, light and dark mode, works at phone width
- Link previews (Open Graph image) and an Add to Home Screen icon and manifest
- **Make your own card** (`/create/`): anyone can fill in a form, watch a live preview, and get a link and QR code for their own card
- **Social links**: LinkedIn, Instagram, Facebook, X, GitHub, YouTube, WhatsApp, Telegram, TikTok, Threads, Snapchat, Pinterest, Reddit, Discord, Dribbble, Behance, Medium, or any other link. Type a handle and it becomes the right URL
- **10 themes**: Classic (follows light/dark mode), Midnight, Forest, Sunset, Rose, Ocean, Lavender, Mono, Noir & Gold, Paper. All meet WCAG AA contrast
- **Print**: real-size 85 × 55 mm cards, either one front and back, or a sheet of 8 (fronts on page 1, backs on page 2, for double-sided printing)

## Cards for anyone

`/create/` is an editor with a live preview. It gives a link like `/card/#d=...` where the card's details are compressed into the part after `#`. That means:

- no sign-up, database or server: it runs on the same static hosting
- the details never reach the server, since browsers don't send the `#` part
- a card can't be changed after sharing: editing makes a new link (the editor keeps a draft in the browser, and **Edit a copy of this card** reopens any card in the editor)
- everything read from a link is cleaned: only `http(s)` links are kept, and lengths are capped

Shared cards use a generic link preview, not yours.

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Edit your details

Everything lives in `shared/card.ts`. Change a value there and the website, the mobile app, both QR codes and the `.vcf` file all update.

## Project layout

```
shared/
  card.ts                 card content and types
  vcard.ts                vCard builder
  themes.ts               the 10 card themes
index.html                your card (/)
card/index.html           cards other people make (/card/)
create/index.html         the editor (/create/)
src/
  App.tsx                 your card page
  pages/CreatePage.tsx    editor with live preview
  pages/ViewPage.tsx      shows a card from its link
  lib/cardLink.ts         packs a card into a link and reads it back safely
  lib/social.ts           social platforms: icons and handle -> URL
  lib/theme.ts            applies a theme to a card or the page
  components/PrintCard.tsx  print dialog and the printed card faces
  lib/vcard.ts            .vcf download (web)
  lib/useCopy.ts          clipboard hook
  components/
    BusinessCard.tsx      card layout
    ActionBar.tsx         Save contact / Share buttons
    ContactRow.tsx        one contact line with copy button
    ContactQr.tsx         QR code panel
    SkillList.tsx         skill chips
```

## Deploy

**Vercel**: push to GitHub, import the repo at vercel.com, keep the detected Vite settings.

**Netlify**: build command `npm run build`, publish directory `dist`.

**GitHub Pages**: set `base: "/<repo-name>/"` in `vite.config.ts`, build, and publish `dist/`.

The social preview image (`public/og-image.png`) and icons are static files. If you change your name, title or skills, regenerate them so link previews match.
