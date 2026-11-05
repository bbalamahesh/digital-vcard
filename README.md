# Digital vCard

A digital business card for Bala Mahesh B, built with Vite, React, TypeScript and Tailwind CSS v4.

- **Save contact**: downloads a `.vcf` file that phones import straight into Contacts
- **Scan to save**: the QR code holds the full vCard, so scanning adds the contact without any internet
- **Share**: opens the phone's share sheet, or copies the link on desktop
- Copy buttons on every contact row, light and dark mode, works at phone width

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

## Edit your details

Everything lives in `src/data/card.ts`. Change a value there and the page, QR code and `.vcf` file all update.

## Project layout

```
src/
  data/card.ts            card content and types
  lib/vcard.ts            vCard builder + download
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

Once it's live, you can also print a second QR code that points to the site URL, so people land on the full card instead of only saving the contact.
