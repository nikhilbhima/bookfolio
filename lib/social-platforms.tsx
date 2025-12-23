import { Instagram, Linkedin, Mail, Globe, Github, Youtube, Music2 } from "lucide-react";
import { XIcon } from "@/components/icons/x-icon";
import { MediumIcon } from "@/components/icons/medium-icon";
import { ArenaIcon } from "@/components/icons/arena-icon";
import { SubstackIcon } from "@/components/icons/substack-icon";
import { PinterestIcon } from "@/components/icons/pinterest-icon";

export interface SocialPlatform {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  inputType: "username" | "url" | "email";
  placeholder: string;
  baseUrl?: string;
  urlPattern?: RegExp;
  allowMultiple?: boolean; // Allow multiple instances of this platform
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: XIcon,
    inputType: "username",
    placeholder: "username",
    baseUrl: "https://x.com/",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    inputType: "username",
    placeholder: "username",
    baseUrl: "https://instagram.com/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    inputType: "url",
    placeholder: "https://linkedin.com/in/yourprofile",
    urlPattern: /^https?:\/\/(www\.)?linkedin\.com\//,
  },
  {
    id: "medium",
    label: "Medium",
    icon: MediumIcon,
    inputType: "url",
    placeholder: "https://medium.com/@username or https://username.medium.com",
    urlPattern: /^https?:\/\/([\w-]+\.)?medium\.com/,
  },
  {
    id: "arena",
    label: "Are.na",
    icon: ArenaIcon,
    inputType: "url",
    placeholder: "https://are.na/username",
    urlPattern: /^https?:\/\/(www\.)?are\.na\//,
  },
  {
    id: "substack",
    label: "Substack",
    icon: SubstackIcon,
    inputType: "url",
    placeholder: "https://yourname.substack.com",
    urlPattern: /^https?:\/\/[\w-]+\.substack\.com/,
  },
  {
    id: "pinterest",
    label: "Pinterest",
    icon: PinterestIcon,
    inputType: "username",
    placeholder: "username",
    baseUrl: "https://pinterest.com/",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    inputType: "username",
    placeholder: "username",
    baseUrl: "https://github.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    inputType: "url",
    placeholder: "https://youtube.com/@yourchannel",
    urlPattern: /^https?:\/\/(www\.)?youtube\.com\//,
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: Music2,
    inputType: "url",
    placeholder: "https://open.spotify.com/user/yourprofile",
    urlPattern: /^https?:\/\/open\.spotify\.com\//,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    inputType: "email",
    placeholder: "your@email.com",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe,
    inputType: "url",
    placeholder: "https://yourwebsite.com",
    urlPattern: /^https?:\/\//,
    allowMultiple: true, // Allow multiple websites (blog, portfolio, etc.)
  },
];

export function getPlatformById(id: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((p) => p.id === id);
}

export function buildSocialUrl(platform: SocialPlatform, value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "";

  if (platform.inputType === "username" && platform.baseUrl) {
    // Remove @ symbol and slashes if user included them
    const cleanUsername = trimmedValue.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
    return `${platform.baseUrl}${cleanUsername}`;
  }

  if (platform.inputType === "email") {
    return `mailto:${trimmedValue}`;
  }

  // For URL types, return as-is (already validated)
  return trimmedValue;
}

export function extractValueFromUrl(platform: SocialPlatform, url: string): string {
  if (!url) return "";

  if (platform.inputType === "username" && platform.baseUrl) {
    if (url.startsWith(platform.baseUrl)) {
      return url.slice(platform.baseUrl.length);
    }
    // If it doesn't have the base URL, assume it's already just the username
    return url.replace(/^@/, "").replace(/^\/+|\/+$/g, "");
  }

  if (platform.inputType === "email" && url.startsWith("mailto:")) {
    return url.slice(7);
  }

  return url;
}
