import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowUpRight, Terminal, Cpu, GitBranch, CheckCircle2, Circle,
  Loader2, Send, ChevronRight, Activity, Box, Layers, Globe,
  Github, MessageSquare, Zap, Clock, Database, Shield, Wifi,
  X, Minimize2, Maximize2,
} from "lucide-react";
import mqLogo from "@/assets/mq-logo.png";
import { chatWithAgent } from "@/lib/agent.functions";

export const Route = createFileRoute("/workspace")({
  component: WorkspacePage,
  head: () => ({
    meta: [
      { title: "Hermes Agent Workspace — merQato.digital" },
      { name: "description", content: "Live working environment for the Hermes AI Agent. Watch the agent work, chat with it, and see real-time activity." },
      { property: "og:title", content: "Hermes Agent Workspace — merQato.digital" },
      { property: "og:description", content: "Live working environment for the Hermes AI Agent." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function MQLogo({ className = "" }: { className?: string }) {
  return <img src={mqLogo} alt="MQ" className={className} />;
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

// ────── Header ──────

function WorkspaceHeader() {
  return (
    <header className="px-4 md:px-6 lg:px-10 pt-5 md:pt-6 pb-4">
      <div className="grid grid-cols-12 gap-3 md:gap-4 text-[10px] uppercase tracking-[0.14em]">
        <div className="col-span-6 md:col-span-4">
          <Link to="/" className="hover:text-accent transition-colors">
            <div className="text-ink">MERQATO.DIGITAL</div>
            <div className="text-ink-mute mt-0.5 text-[9px] md:text-[10px]">DIGITAL INFRASTRUCTURE STUDIO</div>
          </Link>
        </div>
        <div className="col-span-6 md:col-span-4 flex justify-end md:justify-center items-start gap-4 md:gap-6">
          <Link to="/" className="text-ink-dim hover:text-accent transition-colors">HOME</Link>
          <Link to="/agents" className="text-ink-dim hover:text-accent transition-colors">OPERATORS</Link>
          <span className="text-accent border-b border-accent">WORKSPACE</span>
        </div>
        <div className="hidden md:flex col-span-4 justify-end">
          <MQLogo className="w-12 h-auto" />
        </div>
      </div>
    </header>
  );
}

// ────── System Status Bar ──────

function SystemStatusBar() {
  const systems = [
    { label: "AGENT", status: "ONLINE" },
    { label: "MEMORY", status: "ACTIVE" },
    { label: "TOOLS", status: "LOADED" },
    { label: "TERMINAL", status: "READY" },
    { label: "DEPLOY", status: "STANDBY" },
  ];
  return (
    <div className="px-4 md:px-6 lg:px-10">
      <div className="border border-line bg-surface/30 px-3 py-2 flex items-center gap-6 text-[9px] uppercase tracking-[0.14em] overflow-x-auto">
        {systems.map((s) => (
          <div key={s.label} className="flex items-center gap-2 shrink-0">
            <Dot className="animate-pulse" />
            <span className="text-ink-dim">{s.label}</span>
            <span className="text-accent">{s.status}</span>
          </div>
        ))}
        <div className="ml-auto text-ink-mute shrink-0">
          <Clock className="w-3 h-3 inline mr-1" />
          {new Date().toLocaleTimeString("en-US", { hour12: false })}
        </div>
      </div>
    </div>
  );
}

// ────── Live Agent Terminal ──────

const workspaceQuestions = [
  "What are you working on right now?",
  "Show me the current project status",
  "What tools do you have access to?",
  "Deploy the latest changes",
];

function AgentTerminal() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "ai",
      content: "SYSTEM READY.\n\nI'm Hermes — your AI agent. I live in this workspace. I can write code, push to GitHub, deploy to Vercel, manage content, and build webapps.\n\nStatus: All systems online. What do you want me to work on?",
    },
  ]);
  const [displayedTexts, setDisplayedTexts] = useState<Record<number, string>>({});
  const [minimized, setMinimized] = useState(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const lastIdx = messages.length - 1;
    if (lastIdx < 0) return;
    const last = messages[lastIdx];
    if (last.role !== "ai") return;
    if (displayedTexts[lastIdx] === last.content) return;
    let i = displayedTexts[lastIdx]?.length || 0;
    if (i >= last.content.length) return;
    const interval = setInterval(() => {
      i++;
      setDisplayedTexts((prev) => ({ ...prev, [lastIdx]: last.content.slice(0, i) }));
      if (i >= last.content.length) clearInterval(interval);
    }, 12);
    return () => clearInterval(interval);
  }, [messages, displayedTexts]);

  const askAI = useCallback(
    async (userMessage: string) => {
      const newMessages = [...messages, { role: "user" as const, content: userMessage }];
      setMessages(newMessages);
      setInput("");
      setLoading(true);
      try {
        const apiMessages = newMessages.map((m) => ({
          role: (m.role === "ai" ? "assistant" : m.role) as "user" | "assistant" | "system",
          content: m.content,
        }));
        const res = await chatWithAgent({ data: { messages: apiMessages } });
        const reply = res.content || "Processing...";
        setMessages((prev) => [...prev, { role: "ai", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Connection issue. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages],
  );

  const handleSend = () => {
    if (!input.trim() || loading) return;
    askAI(input.trim());
  };

  return (
    <div className="corner border border-line overflow-hidden flex flex-col">
      <div className="c1" /><div className="c2" />
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-surface/50 shrink-0">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.14em]">
          <Terminal className="w-4 h-4 text-accent" />
          <Dot className={loading ? "animate-pulse" : ""} />
          <span className="text-accent">AGENT TERMINAL</span>
          <span className="text-ink-dim">/ {loading ? "PROCESSING" : "IDLE"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setMinimized(!minimized)} className="text-ink-dim hover:text-accent p-1">
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="h-[350px] md:h-[450px] overflow-y-auto p-4 space-y-3 bg-background font-mono">
            {messages.map((msg, i) => {
              const isAi = msg.role === "ai";
              const isLastAi = isAi && i === messages.length - 1;
              const text = isLastAi && displayedTexts[i] !== undefined ? displayedTexts[i] : msg.content;
              const fullyRevealed = isLastAi && displayedTexts[i]?.length >= msg.content.length;
              return (
                <div key={i} className={`flex ${!isAi ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 text-[11px] leading-relaxed whitespace-pre-wrap ${!isAi ? "bg-accent/10 border border-accent/30 text-ink" : "border border-line-soft text-ink-dim"}`}>
                    {!isAi && <div className="text-accent text-[9px] uppercase tracking-[0.14em] mb-1">YOU</div>}
                    {isAi && <div className="text-accent text-[9px] uppercase tracking-[0.14em] mb-1">◈ HERMES</div>}
                    {text}
                    {isLastAi && !fullyRevealed && displayedTexts[i] && (
                      <span className="inline-block w-1.5 h-3 bg-accent/60 ml-0.5 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
            {loading && !messages[messages.length - 1]?.role?.includes("ai") && (
              <div className="flex justify-start">
                <div className="border border-line-soft px-4 py-3 text-[11px] text-ink-dim flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  Processing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested */}
          <div className="px-4 py-2.5 border-t border-line bg-surface/30">
            <div className="flex flex-wrap gap-2">
              {workspaceQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={loading}
                  onClick={() => askAI(q)}
                  className="text-[9px] uppercase tracking-[0.14em] border border-line-soft px-2.5 py-1.5 text-ink-dim hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex border-t border-line shrink-0">
            <div className="flex items-center px-3 text-accent text-[11px] font-mono">❯</div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={loading ? "Waiting for response..." : "Talk to Hermes..."}
              disabled={loading}
              className="flex-1 bg-background px-2 py-3 text-[12px] text-ink placeholder:text-ink-mono outline-none font-mono disabled:opacity-50"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-5 py-3 border-l border-line text-[10px] uppercase tracking-[0.14em] text-accent hover:bg-accent/10 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? "..." : "Send"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ────── Activity Feed ──────

type ActivityItem = {
  id: string;
  icon: typeof Terminal;
  text: string;
  time: string;
  type: "info" | "success" | "work" | "deploy";
};

const liveActivity: ActivityItem[] = [
  { id: "a1", icon: Cpu, text: "Hermes Agent workspace initialized", time: "Just now", type: "success" },
  { id: "a2", icon: GitBranch, text: "Connected to tropical-systems-studio repo", time: "Just now", type: "info" },
  { id: "a3", icon: Terminal, text: "Terminal ready — all tools loaded", time: "Just now", type: "info" },
  { id: "a4", icon: Globe, text: "Monitoring merqato.digital deployment", time: "Live", type: "work" },
  { id: "a5", icon: Database, text: "Content store synced with Supabase", time: "Live", type: "info" },
  { id: "a6", icon: Shield, text: "GitHub auth configured", time: "Active", type: "success" },
  { id: "a7", icon: Zap, text: "Vercel deployment pipeline ready", time: "Standby", type: "deploy" },
  { id: "a8", icon: Wifi, text: "OpenRouter AI connection active", time: "Live", type: "success" },
];

function ActivityFeed() {
  const iconColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "success": return "text-accent";
      case "work": return "text-amber-400";
      case "deploy": return "text-blue-400";
      default: return "text-ink-dim";
    }
  };
  return (
    <div className="corner border border-line overflow-hidden">
      <div className="c1" /><div className="c2" />
      <div className="px-4 py-3 border-b border-line bg-surface/50">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
          <Activity className="w-4 h-4 text-accent" />
          <span className="text-accent">LIVE ACTIVITY</span>
          <Dot className="animate-pulse ml-1" />
        </div>
      </div>
      <div className="divide-y divide-line-soft">
        {liveActivity.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-start gap-3 hover:bg-surface/30 transition-colors">
            <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor(item.type)}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-ink leading-snug">{item.text}</div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-ink-mute mt-1">{item.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────── Capability Cards ──────

const capabilities = [
  {
    icon: Terminal,
    tag: "01",
    title: "Code & Build",
    desc: "Write React, TypeScript, Tailwind CSS. Build full-stack webapps from scratch.",
    skills: ["React 19", "TypeScript", "Tailwind 4", "Vite", "Node.js"],
  },
  {
    icon: GitBranch,
    tag: "02",
    title: "Git & Deploy",
    desc: "Push to GitHub, trigger Vercel deployments, manage branches and PRs.",
    skills: ["GitHub", "Vercel", "CI/CD", "Branching"],
  },
  {
    icon: Database,
    tag: "03",
    title: "Content & CMS",
    desc: "Read, write, and manage site content. Edit blog posts, portfolio items, and more.",
    skills: ["Supabase", "Zustand", "CMS", "Media"],
  },
  {
    icon: Globe,
    tag: "04",
    title: "Research & Search",
    desc: "Search the web, check calendars, browse files, and gather information.",
    skills: ["Web Search", "File I/O", "APIs", "Research"],
  },
  {
    icon: MessageSquare,
    tag: "05",
    title: "Communication",
    desc: "Post to messaging platforms, send notifications, and interact across channels.",
    skills: ["Telegram", "Discord", "Signal", "Email"],
  },
  {
    icon: Box,
    tag: "06",
    title: "Autonomous Agents",
    desc: "Spawn sub-agents, schedule cron jobs, and orchestrate complex multi-step workflows.",
    skills: ["Cron Jobs", "Sub-agents", "Workflows", "Task Lists"],
  },
];

function CapabilityCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {capabilities.map((cap) => (
        <div key={cap.tag} className="corner border border-line p-4 hover:border-accent/40 transition-colors group">
          <div className="c1" /><div className="c2" />
          <div className="flex items-start justify-between mb-3">
            <cap.icon className="w-5 h-5 text-accent" />
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-mute">{cap.tag}</span>
          </div>
          <h3 className="text-[12px] uppercase tracking-[0.1em] text-ink mb-1">{cap.title}</h3>
          <p className="text-[11px] text-ink-dim leading-relaxed mb-3">{cap.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {cap.skills.map((skill) => (
              <span key={skill} className="text-[9px] uppercase tracking-[0.1em] border border-line-soft px-1.5 py-0.5 text-ink-mute group-hover:border-accent/30 group-hover:text-accent/80 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ────── Project Status ──────

const projects = [
  { name: "tropical-systems-studio", status: "LIVE", version: "v2.0", env: "Vercel", lastDeploy: "Active" },
  { name: "hermes-workspace", status: "BUILDING", version: "v1.0", env: "Local", lastDeploy: "In Progress" },
  { name: "webapp-palawan", status: "READY", version: "v1.0", env: "GitHub", lastDeploy: "Synced" },
];

function ProjectStatus() {
  const statusColor = (s: string) => {
    if (s === "LIVE") return "text-accent";
    if (s === "BUILDING") return "text-amber-400";
    return "text-ink-dim";
  };
  return (
    <div className="corner border border-line overflow-hidden">
      <div className="c1" /><div className="c2" />
      <div className="px-4 py-3 border-b border-line bg-surface/50">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]">
          <Layers className="w-4 h-4 text-accent" />
          <span className="text-accent">PROJECTS</span>
        </div>
      </div>
      <div className="divide-y divide-line-soft">
        {projects.map((p) => (
          <div key={p.name} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dot className={p.status === "LIVE" ? "animate-pulse" : ""} />
              <div>
                <div className="text-[11px] text-ink font-mono">{p.name}</div>
                <div className="text-[9px] uppercase tracking-[0.14em] text-ink-mute">{p.version} · {p.env}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] uppercase tracking-[0.14em] ${statusColor(p.status)}`}>{p.status}</div>
              <div className="text-[9px] text-ink-mute">{p.lastDeploy}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────── Footer ──────

function WorkspaceFooter() {
  return (
    <footer className="px-6 lg:px-10 pt-12 pb-6 mt-8 border-t border-line">
      <div className="grid grid-cols-12 gap-4 items-center text-[10px] uppercase tracking-[0.14em]">
        <div className="col-span-12 md:col-span-4">
          <div className="text-ink">MERQATO.DIGITAL</div>
          <div className="text-ink-mute mt-0.5">HERMES AGENT WORKSPACE</div>
        </div>
        <div className="col-span-12 md:col-span-4 flex items-center justify-center gap-4">
          <Link to="/" className="text-ink-dim hover:text-accent transition-colors">HOME</Link>
          <Link to="/agents" className="text-ink-dim hover:text-accent transition-colors">OPERATORS</Link>
          <span className="text-accent">WORKSPACE</span>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <div className="text-ink">© 2026 MERQATO.DIGITAL</div>
          <div className="text-ink-mute mt-0.5">ALL SYSTEMS RESERVED</div>
        </div>
      </div>
    </footer>
  );
}

// ────── Main Page ──────

function WorkspacePage() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <WorkspaceHeader />

      {/* Hero */}
      <section className="px-4 md:px-6 lg:px-10 pt-4">
        <div className="corner border border-line relative overflow-hidden">
          <div className="c1" /><div className="c2" />
          <div className="relative py-10 md:py-16 px-6 md:px-10 text-center">
            <div className="label text-[9px] md:text-[10px] mb-3 text-accent">
              — MY WORKING ENVIRONMENT —
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-ink leading-[0.95]">
              Hermes Agent<br />Workspace
            </h1>
            <p className="mt-4 max-w-xl mx-auto text-ink-dim text-[11px] md:text-[12px] leading-relaxed">
              This is where I live and work. Chat with me directly, see what I'm capable of,
              and watch the activity feed for real-time status.
            </p>
            <div className="mt-4 flex justify-center">
              <SystemStatusBar />
            </div>
          </div>
        </div>
      </section>

      {/* Main content: Terminal + Activity */}
      <section className="px-4 md:px-6 lg:px-10 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <AgentTerminal />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <ActivityFeed />
            <ProjectStatus />
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-4 md:px-6 lg:px-10 pt-12">
        <div className="border-t border-line pt-6 mb-6">
          <div className="label text-accent mb-2">/ CAPABILITIES</div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink">
            What I Can Do
          </h2>
        </div>
        <CapabilityCards />
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 lg:px-10 pt-12 pb-4">
        <div className="corner border border-accent/40 relative overflow-hidden p-8 md:p-12 text-center">
          <div className="c1" /><div className="c2" />
          <div className="relative">
            <div className="label text-accent mb-3">/ NEED AN AI OPERATOR?</div>
            <h2 className="font-serif text-2xl md:text-4xl text-ink max-w-xl mx-auto leading-[1.05]">
              Let's build something together
            </h2>
            <p className="mt-3 text-ink-dim text-[12px] max-w-md mx-auto">
              Talk to me right here in the workspace, or reach out to the merQato team for your business.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="/agents#demo-chat" className="inline-flex items-center gap-2 border border-accent bg-accent/10 px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-accent hover:bg-accent hover:text-background transition-all">
                AI Operators <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="mailto:hello@merqato.digital" className="inline-flex items-center gap-2 border border-line px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-ink-dim hover:border-accent hover:text-accent transition-all">
                Contact Team <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <WorkspaceFooter />
    </main>
  );
}
