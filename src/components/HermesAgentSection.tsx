import { useState, useEffect, useRef, useCallback } from "react";
import { useContent } from "@/store/content";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Loader2,
  Terminal,
  Cpu,
  GitBranch,
  Send,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Bot,
  Sparkles,
  Activity,
} from "lucide-react";

function StageIcon({ stage }: { stage: string }) {
  if (stage.includes("DESIGN") || stage.includes("PROTOTYPING"))
    return <Cpu className="w-5 h-5 text-accent" />;
  if (stage.includes("DEV") || stage.includes("BUILD"))
    return <Terminal className="w-5 h-5 text-accent" />;
  return <GitBranch className="w-5 h-5 text-accent" />;
}

function TaskStatus({ status }: { status: "todo" | "in-progress" | "done" }) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />;
    case "in-progress":
      return <Loader2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-spin" />;
    case "todo":
      return <Circle className="w-3.5 h-3.5 text-ink-dim shrink-0 mt-0.5" />;
  }
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-line-soft rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent to-amber-400 transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

// ─── Live Agent Mini-Terminal ───

const CAPABILITY_DEMOS = [
  {
    icon: Globe,
    title: "Web Builder",
    desc: "Upload a menu photo → instant mobile ordering website",
    prompt: "Build me a website for my beach resort restaurant",
  },
  {
    icon: MessageSquare,
    title: "Guest Concierge",
    desc: "Auto-reply to WhatsApp, FB, and website messages 24/7",
    prompt: "A guest wants to book a room for next weekend, help them",
  },
  {
    icon: Activity,
    title: "Operations",
    desc: "Task lists, inventory alerts, sales reports, marketing posts",
    prompt: "Generate today's housekeeping checklist and a Facebook promo post",
  },
  {
    icon: Shield,
    title: "Security & Auth",
    desc: "Full auth system, admin panels, role-based access control",
    prompt: "Add user authentication to my resort booking site",
  },
];

const TERMINAL_LINES = [
  { type: "system" as const, text: "Hermes Agent v2.4.1 — Online" },
  { type: "system" as const, text: "Workspace: /workspace/tropical-systems-studio" },
  { type: "input" as const, text: "$ agent status --all" },
  {
    type: "output" as const,
    text: "✓ Web Builder      ready\n✓ Guest Concierge  ready\n✓ Operations       ready\n✓ Security         ready\n✓ Deploy Pipeline  ready",
  },
  { type: "input" as const, text: "$ agent capabilities" },
  {
    type: "output" as const,
    text: "1. Build websites from photos/sketch\n2. Manage guest communications\n3. Generate operations reports\n4. Create marketing content\n5. Deploy to edge globally",
  },
];

function MiniTerminal() {
  const [lines, setLines] = useState(TERMINAL_LINES);
  const [started, setStarted] = useState(false);
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const runDemo = useCallback((idx: number) => {
    const demo = CAPABILITY_DEMOS[idx];
    setActiveDemo(idx);
    setStarted(true);
    const newLines = [
      ...lines,
      { type: "input" as const, text: `$ agent run ${demo.title.toLowerCase()}` },
      { type: "output" as const, text: `→ ${demo.desc}` },
      { type: "output" as const, text: "→ Processing... ✓ Done" },
      { type: "system" as const, text: `[${demo.title}] capability verified and ready.` },
    ];
    setLines(newLines);
    setTimeout(() => setActiveDemo(null), 1500);
  }, [lines]);

  return (
    <div className="border border-line overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-3 py-2 bg-surface border-b border-line">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-ink-dim ml-2">
            HERMES AGENT TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-accent">
            LIVE
          </span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-3 bg-background font-mono text-[11px] leading-relaxed min-h-[180px] max-h-[240px] overflow-y-auto">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            {line.type === "system" ? (
              <span className="text-ink-dim">[{line.text}]</span>
            ) : line.type === "input" ? (
              <span className="text-accent">{line.text}</span>
            ) : (
              <span className="text-ink whitespace-pre-wrap">{line.text}</span>
            )}
          </div>
        ))}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-accent">$</span>
          <span className="w-2 h-4 bg-accent/60 animate-pulse" />
        </div>
        <div ref={bottomRef} />
      </div>

      {/* Capability buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-line">
        {CAPABILITY_DEMOS.map((demo, i) => (
          <button
            key={i}
            type="button"
            disabled={activeDemo !== null}
            onClick={() => runDemo(i)}
            className={`flex items-center gap-2 px-3 py-2.5 text-[9px] uppercase tracking-[0.12em] border-r border-line last:border-r-0 hover:bg-accent/10 transition-colors disabled:opacity-50 ${
              activeDemo === i ? "bg-accent/10 text-accent" : "text-ink-dim"
            }`}
          >
            <demo.icon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{demo.title}</span>
            {activeDemo === i && <Loader2 className="w-3 h-3 animate-spin ml-auto" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Section ───

export default function HermesAgentSection() {
  const { content } = useContent();
  const ha = content.hermesAgent;

  return (
    <section className="px-4 md:px-6 lg:px-10 pt-16 md:pt-20">
      <div className="border-t border-line pt-6">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-3 items-end pb-6">
          <div className="col-span-12 lg:col-span-5">
            <div className="label flex items-center gap-2">
              <Dot className="animate-pulse" />
              <span className="text-accent tracking-[0.18em]">
                / WORKING AREA
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mt-2">
              {ha.title}
            </h2>
            <p className="text-ink-dim text-[11px] uppercase tracking-[0.1em] mt-2 max-w-lg">
              {ha.description}
            </p>
          </div>
          <div className="hidden lg:flex col-span-3 items-center gap-3">
            <Bot className="w-5 h-5 text-accent" />
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim leading-relaxed">
              <div>ACTIVE</div>
              <div className="text-accent">DEVELOPMENT</div>
            </div>
          </div>
          <div className="hidden lg:flex col-span-4 items-center gap-4 justify-end">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                PROGRESS
              </div>
              <div className="text-ink text-sm font-mono">{ha.progress}%</div>
            </div>
            <div className="w-32">
              <ProgressBar value={ha.progress} />
            </div>
          </div>
        </div>

        {/* Live Agent Terminal — main feature */}
        <div className="corner border border-line relative overflow-hidden mb-4">
          <div className="c1" />
          <div className="c2" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: "linear-gradient(to right, var(--color-line) 1px, transparent 1px), linear-gradient(to bottom, var(--color-line) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }} />
          <div className="relative p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-accent/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-accent">
                    INTERACTIVE DEMO
                  </div>
                  <div className="text-ink text-[11px]">
                    Click a capability below to see the agent in action
                  </div>
                </div>
              </div>
              <a
                href="/agents"
                className="label flex items-center gap-1.5 text-accent hover:underline"
              >
                FULL OPERATOR <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <MiniTerminal />
          </div>
        </div>

        {/* Two-column: Stage info + Capability cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Current stage */}
          <div className="corner border border-line p-4 md:p-5 relative overflow-hidden">
            <div className="c1" />
            <div className="c2" />
            <div className="flex items-center gap-3 mb-4">
              <StageIcon stage={ha.currentStage} />
              <div>
                <div className="label text-[10px]">CURRENT STAGE</div>
                <div className="text-ink text-sm uppercase tracking-[0.1em]">
                  {ha.currentStage}
                </div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between items-end mb-1.5">
                <span className="label text-[10px]">OVERALL PROGRESS</span>
                <span className="text-ink text-[11px] font-mono">
                  {ha.progress}%
                </span>
              </div>
              <ProgressBar value={ha.progress} />
            </div>
            <div className="border-t border-line-soft pt-3 mt-3">
              <div className="label text-[9px]">NEXT MILESTONE</div>
              <div className="text-ink text-xs uppercase tracking-[0.1em] flex items-center gap-1.5 mt-0.5">
                {ha.nextMilestone}
                <ArrowUpRight className="w-3 h-3 text-accent" />
              </div>
            </div>
          </div>

          {/* Capability cards */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            {CAPABILITY_DEMOS.map((cap, i) => (
              <div
                key={i}
                className="corner border border-line p-4 relative overflow-hidden group hover:border-accent/40 transition-colors"
              >
                <div className="c1" />
                <div className="c2" />
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 border border-line-soft flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                    <cap.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-ink text-[11px] uppercase tracking-[0.12em]">
                      {cap.title}
                    </div>
                    <div className="text-ink-dim text-[10px] leading-relaxed mt-1">
                      {cap.desc}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[9px] uppercase tracking-[0.12em] text-accent/60 group-hover:text-accent transition-colors">
                      <Zap className="w-3 h-3" />
                      <span>READY</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task list timeline */}
        <div className="border border-line">
          <div className="grid grid-cols-12 gap-3 items-center px-4 py-2 border-b border-line text-[9px] uppercase tracking-[0.14em] text-ink-mute bg-surface/50">
            <div className="col-span-6 md:col-span-8">TASK</div>
            <div className="col-span-3 md:col-span-2">STATUS</div>
            <div className="col-span-3 md:col-span-2 text-right">STAGE</div>
          </div>
          {ha.tasks.map((task, idx) => (
            <div
              key={task.id}
              className="grid grid-cols-12 gap-3 items-center px-4 py-2.5 border-b border-line last:border-b-0 text-[11px]"
            >
              <div className="col-span-6 md:col-span-8 flex items-center gap-2">
                <TaskStatus status={task.status} />
                <span
                  className={`${
                    task.status === "todo" ? "text-ink-dim" : "text-ink"
                  }`}
                >
                  {task.description}
                </span>
              </div>
              <div className="col-span-3 md:col-span-2">
                <span
                  className={`label text-[9px] px-1.5 py-0.5 border ${
                    task.status === "done"
                      ? "border-accent/50 text-accent"
                      : task.status === "in-progress"
                      ? "border-amber-400/50 text-amber-400"
                      : "border-line-soft text-ink-dim"
                  }`}
                >
                  {task.status === "done"
                    ? "DONE"
                    : task.status === "in-progress"
                    ? "IN PROGRESS"
                    : "TODO"}
                </span>
              </div>
              <div className="col-span-3 md:col-span-2 text-right">
                <span className="text-ink-dim text-[10px] uppercase tracking-[0.1em]">
                  PHASE {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-line p-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-accent shrink-0" />
            <div>
              <div className="text-ink text-[11px] uppercase tracking-[0.12em]">
                Enter the Workspace
              </div>
              <div className="text-ink-dim text-[10px]">
                Chat with Hermes directly, see capabilities, and watch live activity.
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <a
              href="/workspace"
              className="label flex items-center gap-2 px-4 py-2 border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-background transition-all"
            >
              ENTER WORKSPACE <ChevronRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/agents"
              className="label flex items-center gap-2 px-4 py-2 border border-line text-ink-dim hover:border-accent hover:text-accent transition-all"
            >
              AI OPERATORS <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
