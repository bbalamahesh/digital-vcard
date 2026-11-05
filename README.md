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
src/
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
