import {
  siBehance,
  siDiscord,
  siDribbble,
  siFacebook,
  siGithub,
  siInstagram,
  siMedium,
  siPinterest,
  siReddit,
  siSnapchat,
  siTelegram,
  siThreads,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from "simple-icons";

export interface Platform {
  id: string;
  label: string;
  /** 24x24 SVG path */
  icon: string;
  placeholder: string;
  /** Builds the profile URL from a handle; used when the person doesn't paste a full link */
  fromHandle: (handle: string) => string;
}

const at = (h: string) => h.replace(/^@/, "");

// LinkedIn's logo isn't in the icon set, so this is a simple "in" mark
const linkedinPath =
  "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.72V8z";
const linkPath =
  "M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zM8.5 21a5.5 5.5 0 0 1-3.9-9.4l2.1-2.1a1 1 0 0 1 1.4 1.4L6 13A3.5 3.5 0 0 0 11 18l2.1-2.1a1 1 0 0 1 1.4 1.4l-2.1 2.1A5.5 5.5 0 0 1 8.5 21zm9.2-6.8a1 1 0 0 1-.7-1.7L19 10.4A3.5 3.5 0 0 0 14 5.5l-2.1 2.1a1 1 0 0 1-1.4-1.4l2.1-2.1a5.5 5.5 0 0 1 7.8 7.8l-2.1 2.1a1 1 0 0 1-.6.2z";

export const platforms: Platform[] = [
  { id: "linkedin", label: "LinkedIn", icon: linkedinPath, placeholder: "your-name or full link", fromHandle: (h) => `https://www.linkedin.com/in/${at(h)}` },
  { id: "instagram", label: "Instagram", icon: siInstagram.path, placeholder: "@handle", fromHandle: (h) => `https://instagram.com/${at(h)}` },
  { id: "facebook", label: "Facebook", icon: siFacebook.path, placeholder: "username or full link", fromHandle: (h) => `https://facebook.com/${at(h)}` },
  { id: "x", label: "X", icon: siX.path, placeholder: "@handle", fromHandle: (h) => `https://x.com/${at(h)}` },
  { id: "github", label: "GitHub", icon: siGithub.path, placeholder: "username", fromHandle: (h) => `https://github.com/${at(h)}` },
  { id: "youtube", label: "YouTube", icon: siYoutube.path, placeholder: "@channel", fromHandle: (h) => `https://youtube.com/@${at(h)}` },
  { id: "whatsapp", label: "WhatsApp", icon: siWhatsapp.path, placeholder: "phone with country code", fromHandle: (h) => `https://wa.me/${h.replace(/\D/g, "")}` },
  { id: "telegram", label: "Telegram", icon: siTelegram.path, placeholder: "@username", fromHandle: (h) => `https://t.me/${at(h)}` },
  { id: "tiktok", label: "TikTok", icon: siTiktok.path, placeholder: "@handle", fromHandle: (h) => `https://tiktok.com/@${at(h)}` },
  { id: "threads", label: "Threads", icon: siThreads.path, placeholder: "@handle", fromHandle: (h) => `https://threads.net/@${at(h)}` },
  { id: "snapchat", label: "Snapchat", icon: siSnapchat.path, placeholder: "username", fromHandle: (h) => `https://snapchat.com/add/${at(h)}` },
  { id: "pinterest", label: "Pinterest", icon: siPinterest.path, placeholder: "username", fromHandle: (h) => `https://pinterest.com/${at(h)}` },
  { id: "reddit", label: "Reddit", icon: siReddit.path, placeholder: "u/username", fromHandle: (h) => `https://reddit.com/user/${h.replace(/^\/?u\//, "")}` },
  { id: "discord", label: "Discord", icon: siDiscord.path, placeholder: "invite link", fromHandle: (h) => `https://discord.gg/${at(h)}` },
  { id: "dribbble", label: "Dribbble", icon: siDribbble.path, placeholder: "username", fromHandle: (h) => `https://dribbble.com/${at(h)}` },
  { id: "behance", label: "Behance", icon: siBehance.path, placeholder: "username", fromHandle: (h) => `https://behance.net/${at(h)}` },
  { id: "medium", label: "Medium", icon: siMedium.path, placeholder: "@username", fromHandle: (h) => `https://medium.com/@${at(h)}` },
];

export const OTHER = "other";

export const platformByLabel = (label: string) =>
  platforms.find((p) => p.label.toLowerCase() === label.trim().toLowerCase() || p.id === label.trim().toLowerCase());

/** Icon for a link: the platform's logo, or a plain link icon. */
export const iconFor = (label: string) => platformByLabel(label)?.icon ?? linkPath;

/** A full link is used as-is; a bare handle goes through the platform. */
export function profileUrl(platform: Platform | undefined, value: string): string {
  const v = value.trim();
  if (!v) return "";
  // A handle can contain dots (instagram.com/priya.designs), so only treat it as
  // a link when it has a scheme, starts with www. or has a path
  const looksLikeUrl = /^[a-z][a-z0-9+.-]*:/i.test(v) || /^www\./i.test(v) || /^[^\s/@]+\.[a-z]{2,}\//i.test(v);
  if (!platform || looksLikeUrl) return v;
  return platform.fromHandle(v);
}
