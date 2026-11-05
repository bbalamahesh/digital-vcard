// Single source of truth for the card. Edit here and everything updates:
// the page, the QR code and the downloadable .vcf file.

export interface CardLink {
  label: string;
  url: string;
}

export interface CardData {
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  organization?: string;
  location: { city: string; country: string };
  phone?: string;
  email?: string;
  website?: string;
  links: CardLink[];
  skills: string[];
  available: boolean;
}

export const card: CardData = {
  firstName: "Bala Mahesh",
  lastName: "B",
  initials: "BM",
  title: "Frontend Developer",
  location: { city: "Tamil Nadu", country: "India" },
  phone: "+91 98844 00630",
  email: "mahesh2me@gmail.com",
  website: "https://digital-vcard-omega.vercel.app",
  links: [
    { label: "GitHub", url: "https://github.com/bbalamahesh" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/mahesh2me" },
  ],
  skills: [
    "React",
    "Angular",
    "TypeScript",
    "Tailwind",
    "Design Systems",
    "Storybook",
    "Figma",
    "UX",
    "UI",
    "CMS",
  ],
  available: true,
};

export const fullName = (c: CardData) =>
  [c.firstName, c.lastName].filter(Boolean).join(" ");
