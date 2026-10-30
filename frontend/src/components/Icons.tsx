import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

const baseProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Compass: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);

export const LayoutGrid: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

export const FileText: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);

export const Activity: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);

export const Settings: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export const Play: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polygon points="6 3 20 12 6 21 6 3"/></svg>
);

export const Square: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
);

export const RefreshCw: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);

export const Terminal: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
);

export const Eye: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
);

export const Sparkles: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
);

export const Filter: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
);

export const CheckCircle2: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

export const AlertTriangle: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
);

export const AlertCircle: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
);

export const ArrowRight: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export const Clock: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const Zap: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

export const Bot: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

export const Search: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export const ExternalLink: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
);

export const MessageSquare: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

export const Flame: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

export const ChevronDown: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="m6 9 6 6 6-6"/></svg>
);

export const ChevronUp: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="m18 15-6-6-6 6"/></svg>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

export const Copy: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

export const Check: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polyline points="20 6 9 17 4 12"/></svg>
);

export const Download: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export const Video: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect width="14" height="12" x="2" y="6" rx="2"/></svg>
);

export const Palette: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
);

export const Lightbulb: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

export const Film: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);

export const FileSpreadsheet: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/></svg>
);

export const ShieldAlert: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);

export const TrendingDown: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>
);

export const X: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

export const Key: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
);

export const Shield: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
);

export const Globe: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

export const Award: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
);

export const TrendingUp: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);

export const Volume2: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
);

export const Pause: React.FC<IconProps> = (props) => (
  <svg {...baseProps} {...props}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);
