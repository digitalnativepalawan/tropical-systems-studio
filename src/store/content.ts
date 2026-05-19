import { create } from "zustand";
import { persist } from "zustand/middleware";
import hero from "@/assets/hero.jpg";
import b1 from "@/assets/blog-1.jpg";
import b2 from "@/assets/blog-2.jpg";
import b3 from "@/assets/blog-3.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export type BlogPost = {
  id: string;
  category: string;
  meta1: string;
  meta2: string;
  meta3: string;
  date: string;
  title: string;
  image: string;
  videoUrl?: string;
  link?: string;
  author?: string;
  readTime?: string;
  excerpt?: string;
  content?: string;
};

export type PortfolioItem = {
  id: string;
  index: string;
  image: string;
  name: string;
  category: string;
  tag: string;
  description: string;
  status: string;
  deployedDate: string;
  deployedVersion: string;
  environment: string;
  environmentLoc: string;
  role: string;
  roleType: string;
  link: string;
  url: string;
};

export type Content = {
  header: {
    brand: string;
    tagline: string;
    centerLine1: string;
    centerLine2: string;
    rightLine1: string;
    rightLine2: string;
  };
  hero: {
    asset: string;
    process: string;
    environment: string;
    status: string;
    statusValue: string;
    overline: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
    coordN: string;
    coordE: string;
    elev: string;
    buildLog: string;
    deployed: string;
    deployedDate: string;
    systems: string;
    image: string;
  };
  blogTitle: string;
  blogCta: string;
  blog: BlogPost[];
  portfolioTitle: string;
  portfolioSub1: string;
  portfolioSub2: string;
  portfolioSub3: string;
  portfolio: PortfolioItem[];
  footer: {
    brand: string;
    tagline: string;
    col1Label: string;
    col1Value: string;
    col2Label: string;
    col2Value: string;
    col3Label: string;
    col3Value: string;
    copyright: string;
    rights: string;
  };
};

const defaults: Content = {
  header: {
    brand: "MERQATO.DIGITAL",
    tagline: "DIGITAL INFRASTRUCTURE STUDIO",
    centerLine1: "/MICROGRAPHIC SYSTEMS",
    centerLine2: "VERSION 2.0",
    rightLine1: "PALAWAN, PHILIPPINES",
    rightLine2: "LIVE ENVIRONMENT",
  },
  hero: {
    asset: "ASSET_ID 2026_MQ_990X",
    process: "/PROCESS/V02",
    environment: "/ENVIRONMENT/SAN_VICENTE",
    status: "/STATUS/",
    statusValue: "BUILDING",
    overline: "TROPICAL DIGITAL INFRASTRUCTURE",
    title: "merQato.digital",
    subtitle1: "BUILDING OPERATIONAL SYSTEMS",
    subtitle2: "FROM PARADISE",
    coordN: "10.514° N",
    coordE: "119.178° E",
    elev: "ELEV. 14M",
    buildLog: "BUILD_LOG_0024",
    deployed: "DEPLOYED",
    deployedDate: "04.22.26",
    systems: "SYSTEMS",
    image: hero,
  },
  blogTitle: "LATEST INSIGHTS & STORIES",
  blogCta: "VIEW ALL ARTICLES",
  blog: [
    {
      id: "1",
      category: "OPERATIONS",
      meta1: "BUILD_LOG_024",
      meta2: "SV_NODE",
      meta3: "LIVE",
      date: "MAY 20, 2026",
      title: "Building operational systems\nfor modern hospitality",
      image: b1,
    },
    {
      id: "2",
      category: "TECHNOLOGY",
      meta1: "SYSTEMS_ONLINE",
      meta2: "SYNC_ACTIVE",
      meta3: "V02.1",
      date: "MAY 18, 2026",
      title: "Why we build our own tools\nfrom the ground up",
      image: b2,
    },
    {
      id: "3",
      category: "LIFESTYLE",
      meta1: "PALAWAN_NETWORK",
      meta2: "REMOTE_LIFE",
      meta3: "CONNECTED",
      date: "MAY 15, 2026",
      title: "Life and work in Palawan:\nour why",
      image: b3,
    },
  ],
  portfolioTitle: "FEATURED WEB APPLICATIONS",
  portfolioSub1: "SIX SYSTEMS.",
  portfolioSub2: "ONE ECOSYSTEM.",
  portfolioSub3: "BUILT IN PALAWAN.",
  portfolio: [
    { id: "1", index: "01", image: p1, name: "NOMADS.ONE", category: "COMMUNITY PLATFORM", tag: "SOCIAL INFRASTRUCTURE", description: "A global community network connecting digital nomads, creators and remote professionals.", status: "LIVE\nACTIVE", deployedDate: "2026.02.10", deployedVersion: "V02.1", environment: "CLOUD", environmentLoc: "GLOBAL", role: "FOUNDER", roleType: "FULLSTACK", link: "nomads.one", url: "https://nomads.one" },
    { id: "2", index: "02", image: p2, name: "MERQATO.APP", category: "HOSPITALITY OPERATING SYSTEM", tag: "OPERATIONAL PLATFORM", description: "All-in-one backoffice for resorts. Reservations, housekeeping, revenue, maintenance and guest services.", status: "LIVE\nACTIVE", deployedDate: "2026.03.05", deployedVersion: "V01.8", environment: "CLOUD", environmentLoc: "PALAWAN", role: "FOUNDER", roleType: "FULLSTACK", link: "merqato.app", url: "https://merqato.app" },
    { id: "3", index: "03", image: p3, name: "SANVICENTE.PH", category: "MAPS & DIRECTORY", tag: "DISCOVERY PLATFORM", description: "Interactive map and business directory of San Vicente, Palawan. Explore. Discover. Support Local.", status: "LIVE\nACTIVE", deployedDate: "2026.01.20", deployedVersion: "V03.2", environment: "CLOUD", environmentLoc: "PALAWAN", role: "FOUNDER", roleType: "FULLSTACK", link: "sanvicente.ph", url: "https://sanvicente.ph" },
    { id: "4", index: "04", image: p4, name: "MERQATO.SOLAR", category: "SOLAR CALCULATOR", tag: "UTILITY PLATFORM", description: "Solar savings estimator for homes and businesses in tropical regions. Calculate. Save. Go Solar.", status: "LIVE\nACTIVE", deployedDate: "2026.02.28", deployedVersion: "V01.5", environment: "CLOUD", environmentLoc: "GLOBAL", role: "FOUNDER", roleType: "FULLSTACK", link: "merqato.solar", url: "https://merqato.solar" },
    { id: "5", index: "05", image: p5, name: "MERQATO.MENU", category: "DIGITAL MENU SYSTEM", tag: "BUSINESS TOOL", description: "Modern digital menu for restaurants and resorts. Beautiful, fast and mobile-first.", status: "LIVE\nACTIVE", deployedDate: "2026.04.02", deployedVersion: "V01.2", environment: "CLOUD", environmentLoc: "GLOBAL", role: "FOUNDER", roleType: "FULLSTACK", link: "merqato.menu", url: "https://merqato.menu" },
    { id: "6", index: "06", image: p6, name: "MERQATO.STAY", category: "DIRECT BOOKING ENGINE", tag: "BOOKING PLATFORM", description: "Increase direct bookings with a fast, secure and commission-free booking system.", status: "LIVE\nACTIVE", deployedDate: "2026.04.12", deployedVersion: "V01.0", environment: "CLOUD", environmentLoc: "PALAWAN", role: "FOUNDER", roleType: "FULLSTACK", link: "merqato.stay", url: "https://merqato.stay" },
  ],
  footer: {
    brand: "MERQATO.DIGITAL",
    tagline: "TROPICAL DIGITAL INFRASTRUCTURE",
    col1Label: "BUILDING",
    col1Value: "IN PARADISE",
    col2Label: "OPERATING",
    col2Value: "WORLDWIDE",
    col3Label: "CONNECT",
    col3Value: "WITH US",
    copyright: "© 2026 MERQATO.DIGITAL",
    rights: "ALL SYSTEMS RESERVED",
  },
};

type Store = {
  content: Content;
  setContent: (c: Content) => void;
  update: <K extends keyof Content>(key: K, value: Content[K]) => void;
  reset: () => void;
};

export const useContent = create<Store>()(
  persist(
    (set) => ({
      content: defaults,
      setContent: (c) => set({ content: c }),
      update: (key, value) => set((s) => ({ content: { ...s.content, [key]: value } })),
      reset: () => set({ content: defaults }),
    }),
    { name: "merqato-content-v1" }
  )
);
