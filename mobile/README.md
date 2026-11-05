# Digital vCard: mobile app

Expo (SDK 58) + React Native + TypeScript app for Android and iOS. It shows the same card as the website and reads its details from `../shared/card.ts`.

## Features

- **Save to Contacts** opens the phone's New Contact screen with every field filled in
- **Show QR** opens a full-screen, white QR code that keeps the screen awake. You can switch it between saving the contact and opening the card page
- **Share link** sends your name, title and card URL through any app
- **Send vCard** shares a `.vcf` file that the other person taps to import
- Copy buttons and tappable phone, email and links
- Light and dark mode, and it works offline

## Run it on your phone

```bash
cd mobile
npm install
npx expo start
```

The app uses native modules (Contacts, Sharing), so it needs a **development build**. Expo Go isn't enough. You have two options:

- **Android phone over USB:** `npx expo run:android`. This needs Android Studio installed.
- **No local setup:** use EAS in the cloud:
  ```bash
  npx eas-cli@latest login
  npx eas-cli@latest build --profile development --platform android
  ```
  Install the APK it gives you, then run `npx expo start` and open the project from the app.

## Release builds

```bash
npx eas-cli@latest build --platform android   # .aab for Google Play
npx eas-cli@latest build --platform ios       # needs an Apple Developer account
```

App IDs are set in `app.json` as `com.bbalamahesh.digitalvcard`.

## Layout

```
App.tsx                      card screen
src/components/
  CardHeader.tsx             initials, name, role, skill chips
  Actions.tsx                Save / Show QR / Share link / Send vCard
  ContactRow.tsx             one contact line with copy
  QrPanel.tsx                small QR on the card
  FullScreenQr.tsx           full-screen QR mode
src/lib/contact.ts           contacts form, vCard file sharing, link sharing
src/theme.ts                 light and dark palette, matches the website
metro.config.js              lets Metro bundle ../shared
```
