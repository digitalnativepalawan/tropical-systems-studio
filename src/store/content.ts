import { create } from "zustand";
import { loadSiteContent, saveSiteContent } from "@/lib/content.functions";
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
  hermesAgent: {
    title: string;
    description: string;
    currentStage: string;
    progress: number;
    nextMilestone: string;
    interfacePreview: string;
    userFlowDiagram: string;
    layoutPrototype: string;
    tasks: {
      id: string;
      description: string;
      status: 'todo' | 'in-progress' | 'done';
    }[];
  };
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
      author: "MERQATO TEAM",
      readTime: "6 MIN READ",
      excerpt: "How we designed merQato.app to run resorts end-to-end — from reservations to housekeeping — without the usual SaaS bloat.",
      content: "Hospitality software has a reputation for being clunky, expensive, and built for a world that no longer exists. When we set out to design merQato.app, we started by sitting in the lobby of a small resort in Palawan and writing down every single task the team performed in a day.\n\nWhat we found wasn't a software problem. It was a coordination problem. Front desk, housekeeping, maintenance and revenue all lived in separate spreadsheets, separate WhatsApp groups, separate heads. Information moved through the property at the speed of conversation.\n\nSo we built one operating system. Reservations, housekeeping boards, maintenance tickets, revenue dashboards and guest messaging all share the same underlying state. When a guest checks out, housekeeping knows instantly. When a room is flagged for maintenance, the booking engine stops selling it. Nothing has to be remembered. Nothing has to be re-typed.\n\nThe result is a property that runs quieter. Staff spend less time chasing information and more time with guests. Owners see real numbers, in real time, on any device.\n\nThis is what we mean by operational infrastructure: software that fades into the background and lets the work happen.",
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
      author: "MERQATO TEAM",
      readTime: "5 MIN READ",
      excerpt: "Off-the-shelf tools optimize for the average customer. We don't operate average businesses, so we don't use average software.",
      content: "Every time we evaluated an off-the-shelf tool for one of our properties, we ran into the same wall. The tool was good at the eighty percent that every business shares, and useless at the twenty percent that actually makes our business ours.\n\nBuilding our own stack is not about ego. It's about owning the parts of the workflow that matter most. A booking engine that understands our pricing logic. A menu system that speaks the language of our kitchen. A directory that reflects the actual character of the town we live in.\n\nWe use modern building blocks — TypeScript, edge-rendered React, Postgres, Cloudflare — but the surface area is always tailored. Less is more. We ship small. We delete often. The codebase is something we read together on a Monday morning, not a black box we pay a vendor to maintain.\n\nThe tradeoff is real. Building takes time. But every tool we own is a tool that compounds, and an ecosystem that no competitor can copy by writing a check.",
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
      author: "MERQATO TEAM",
      readTime: "4 MIN READ",
      excerpt: "Why we chose to base a digital studio on a remote island, and what that decision has taught us about focus, pace and presence.",
      content: "People assume we moved to Palawan to escape work. The truth is closer to the opposite. We moved here because the noise of the city was making it impossible to do work we were proud of.\n\nThere is a particular kind of clarity that comes from living somewhere with limited bandwidth, limited shops and unlimited horizon. You stop optimizing for inputs and start optimizing for output. You stop reacting and start building.\n\nOur days are simple. Early mornings on the laptops while it is still cool. Long lunches. Afternoons in the water or in the workshop. Evenings reading, sketching, planning the next week. The work is deep because the surroundings invite depth.\n\nWe are not romantic about it. The internet drops, supply chains are fragile, and tropical weather has opinions. But on the balance, this place has made us better operators, better designers and better partners to the businesses we serve.\n\nThis blog is part of that practice — an open log of what we are building, what we are learning, and why we are doing it from here.",
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
  hermesAgent: {
    title: "HERMES AGENT WORKING AREA",
    description: "Development zone for Hermes Agent interfaces, user flows, and experimental webapps.",
    currentStage: "INTERFACE DESIGN & PROTOTYPING",
    progress: 35,
    nextMilestone: "LIVE WORKING DEMO",
    interfacePreview: "/assets/hermes-interface.jpg",
    userFlowDiagram: "/assets/hermes-flow.jpg",
    layoutPrototype: "/assets/hermes-layout.jpg",
    tasks: [
      { id: "t1", description: "Define core interface components", status: "done" },
      { id: "t2", description: "Map primary user flows", status: "in-progress" },
      { id: "t3", description: "Build working prototype", status: "todo" },
      { id: "t4", description: "Integrate with live agent", status: "todo" },
      { id: "t5", description: "Deploy demo environment", status: "todo" },
    ],
  },
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
  loaded: boolean;
  saving: boolean;
  setContent: (c: Content) => void;
  update: <K extends keyof Content>(key: K, value: Content[K]) => void;
  reset: () => void;
  load: () => Promise<void>;
  save: (passkey: string, c: Content) => Promise<void>;
};

export const defaultContent = defaults;

export const useContent = create<Store>()((set, get) => ({
  content: defaults,
  loaded: false,
  saving: false,
  setContent: (c) => set({ content: c }),
  update: (key, value) => set((s) => ({ content: { ...s.content, [key]: value } })),
  reset: () => set({ content: defaults }),
  load: async () => {
    if (get().loaded) return;
    try {
      const res = await loadSiteContent();
      if (res.json) {
        const parsed = JSON.parse(res.json) as Content;
        const merged = { ...defaults, ...parsed } as Content;
        // Self-heal stale bundled asset paths (e.g. /assets/hero-<oldhash>.jpg)
        // from previous builds by falling back to current bundled defaults.
        const isStale = (u?: string) => typeof u === "string" && u.startsWith("/assets/");
        const heroImage = isStale(merged.hero?.image) ? defaults.hero.image : merged.hero.image;
        const blog = (merged.blog ?? []).map((p) => {
          const d = defaults.blog.find((x) => x.id === p.id);
          return { ...p, image: isStale(p.image) && d ? d.image : p.image };
        });
        const portfolio = (merged.portfolio ?? []).map((p) => {
          const d = defaults.portfolio.find((x) => x.id === p.id);
          return { ...p, image: isStale(p.image) && d ? d.image : p.image };
        });
        set({
          content: { ...merged, hero: { ...merged.hero, image: heroImage }, blog, portfolio },
          loaded: true,
        });
      } else {
        set({ loaded: true });
      }
    } catch (e) {
      console.error("Failed to load site content", e);
      set({ loaded: true });
    }
  },
  save: async (passkey, c) => {
    set({ saving: true });
    try {
      await saveSiteContent({ data: { passkey, json: JSON.stringify(c) } });
      set({ content: c });
    } finally {
      set({ saving: false });
    }
  },
}));
