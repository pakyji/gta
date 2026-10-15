/**
 * Inline SVG icon set (no icon dependency). All icons are 24x24 stroke icons.
 */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number | undefined, p: P) => ({
  width: size ?? 22,
  height: size ?? 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const IconMenu = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const IconBack = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
export const IconHome = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);
export const IconChat = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.3A8 8 0 1 1 21 12z" />
  </svg>
);
export const IconBot = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" />
  </svg>
);
export const IconNews = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 9h6M8 13h6M8 17h4" />
  </svg>
);
export const IconBook = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2zM4 19a2 2 0 0 1 2-2h12v4H6a2 2 0 0 1-2-2z" />
  </svg>
);
export const IconSettings = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
);
export const IconDownload = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
export const IconShare = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 3v13m0-13L8 7m4-4l4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </svg>
);
export const IconPlus = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconSend = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 12l16-8-6 16-2.5-6.5z" />
  </svg>
);
export const IconSearch = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);
export const IconRefresh = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M20 11a8 8 0 0 0-14.9-3M4 13a8 8 0 0 0 14.9 3M4 4v5h5M20 20v-5h-5" />
  </svg>
);
export const IconChevron = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const IconExternal = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);
export const IconLogout = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M10 17l5-5-5-5M15 12H3M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
  </svg>
);
export const IconTrash = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </svg>
);
export const IconWifiOff = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M2 2l20 20M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M12 20h.01M19 13a10 10 0 0 0-2-1.6" />
  </svg>
);
export const IconGamepad = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 9h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.6 1.5L15 15H9l-1.4 1.5A3 3 0 0 1 2 15v-2a4 4 0 0 1 4-4zM8 11v4M6 13h4M16 12h.01M18 14h.01" />
  </svg>
);

export const IconSpark = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 2l1.8 5.5L19 9.2l-5.2 1.7L12 16l-1.8-5.1L5 9.2l5.2-1.7zM18 14l.9 2.6L21 18l-2.1.7L18 21l-.9-2.3L15 18l2.1-.7zM6 14l.7 2L9 17l-2.3.5L6 20l-.7-2.5L3 17l2.3-.9z" />
  </svg>
);

export const IconMusic = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);
export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconPause = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconSkipBack = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M19 20L9 12l10-8v16zM5 4v16" />
  </svg>
);
export const IconSkipFwd = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 4l10 8-10 8V4zM19 4v16" />
  </svg>
);
export const IconVolume = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const IconFeed = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 6h16M4 12h16M4 18h10" />
    <circle cx="18" cy="18" r="2" fill="currentColor" stroke="none" />
  </svg>
);
export const IconHeart = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M20.8 8.6a5.5 5.5 0 0 0-7.8 0L12 9.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
export const IconHeartSolid = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path fill="currentColor" stroke="none" d="M20.8 8.6a5.5 5.5 0 0 0-7.8 0L12 9.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);
