import { useContent } from "@/store/content";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Loader2,
  Terminal,
  Cpu,
  GitBranch,
} from "lucide-react";

function StageIcon({ stage }: { stage: string }) {
  if (stage.includes("DESIGN") || stage.includes("PROTOTYPING")) return <Cpu className="w-5 h-5 text-accent" />;
  if (stage.includes("DEV") || stage.includes("BUILD")) return <Terminal className="w-5 h-5 text-accent" />;
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

export default function HermesAgentSection() {
  const { content } = useContent();
  const ha = content.hermesAgent;

  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="border-t border-line pt-4">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-3 items-end pb-4">
          <div className="col-span-12 lg:col-span-6">
            <div className="label flex items-center gap-2">
              <Dot className="animate-pulse" />
              <span className="text-accent tracking-[0.18em]">/ WORKING AREA</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{ha.title}</h2>
            <p className="text-ink-dim text-[11px] uppercase tracking-[0.1em] mt-2 max-w-xl">
              {ha.description}
            </p>
          </div>
          <div className="hidden lg:block col-span-3 text-[10px] uppercase tracking-[0.14em] text-ink-dim leading-relaxed text-right">
            <div>DEVELOPMENT</div>
            <div className="text-accent">{ha.currentStage}</div>
          </div>
          <div className="hidden lg:flex col-span-3 items-center gap-3 justify-end">
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim text-right">
              <div>PROGRESS</div>
              <div className="text-ink">{ha.progress}%</div>
            </div>
            <ProgressBar value={ha.progress} />
          </div>
        </div>

        {/* Main grid: 3-column development overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Column 1: Current stage + progress */}
          <div className="corner border border-line p-4 md:p-5 relative overflow-hidden">
            <div className="c1" /><div className="c2" />
            <div className="flex items-center gap-3 mb-4">
              <StageIcon stage={ha.currentStage} />
              <div>
                <div className="label text-[10px]">CURRENT STAGE</div>
                <div className="text-ink text-sm uppercase tracking-[0.1em]">{ha.currentStage}</div>
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between items-end mb-1.5">
                <span className="label text-[10px]">OVERALL PROGRESS</span>
                <span className="text-ink text-[11px]">{ha.progress}%</span>
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

          {/* Column 2: Product preview cards */}
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Interface preview */}
            <div className="corner border border-line p-0 relative overflow-hidden group cursor-pointer">
              <div className="c1" /><div className="c2" />
              <div className="aspect-[4/3] bg-surface flex items-center justify-center overflow-hidden">
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim text-center p-4 leading-relaxed">
                  <Cpu className="w-8 h-8 text-accent/40 mx-auto mb-2" />
                  <div>INTERFACE</div>
                  <div className="text-[9px] text-ink-mute mt-1">WIREFRAMES</div>
                </div>
              </div>
              <div className="p-2.5 border-t border-line">
                <div className="text-[9px] uppercase tracking-[0.1em] text-ink-dim">INTERFACE DESIGN</div>
                <div className="text-ink text-[11px] flex items-center gap-1">
                  DRAFTING <Dot />
                </div>
              </div>
            </div>

            {/* User flow diagram */}
            <div className="corner border border-line p-0 relative overflow-hidden group cursor-pointer">
              <div className="c1" /><div className="c2" />
              <div className="aspect-[4/3] bg-surface flex items-center justify-center overflow-hidden">
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim text-center p-4 leading-relaxed">
                  <GitBranch className="w-8 h-8 text-accent/40 mx-auto mb-2" />
                  <div>USER FLOW</div>
                  <div className="text-[9px] text-ink-mute mt-1">DIAGRAM</div>
                </div>
              </div>
              <div className="p-2.5 border-t border-line">
                <div className="text-[9px] uppercase tracking-[0.1em] text-ink-dim">USER FLOW</div>
                <div className="text-ink text-[11px] flex items-center gap-1">
                  MAPPING <Dot />
                </div>
              </div>
            </div>

            {/* Layout prototype */}
            <div className="corner border border-line p-0 relative overflow-hidden group cursor-pointer">
              <div className="c1" /><div className="c2" />
              <div className="aspect-[4/3] bg-surface flex items-center justify-center overflow-hidden">
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim text-center p-4 leading-relaxed">
                  <Terminal className="w-8 h-8 text-accent/40 mx-auto mb-2" />
                  <div>PROTOTYPE</div>
                  <div className="text-[9px] text-ink-mute mt-1">LAYOUT</div>
                </div>
              </div>
              <div className="p-2.5 border-t border-line">
                <div className="text-[9px] uppercase tracking-[0.1em] text-ink-dim">LAYOUT</div>
                <div className="text-ink text-[11px] flex items-center gap-1">
                  IN PROGRESS <Dot />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task list timeline */}
        <div className="border border-line mt-4">
          <div className="grid grid-cols-12 gap-3 items-center px-4 py-2 border-b border-line text-[9px] uppercase tracking-[0.14em] text-ink-mute bg-surface/50">
            <div className="col-span-6 md:col-span-8">TASK</div>
            <div className="col-span-3 md:col-span-2">STATUS</div>
            <div className="col-span-3 md:col-span-2 text-right">STAGE</div>
          </div>
          {ha.tasks.map((task, idx) => (
            <div key={task.id} className="grid grid-cols-12 gap-3 items-center px-4 py-2.5 border-b border-line last:border-b-0 text-[11px]">
              <div className="col-span-6 md:col-span-8 flex items-center gap-2">
                <TaskStatus status={task.status} />
                <span className={`${task.status === "todo" ? "text-ink-dim" : "text-ink"}`}>
                  {task.description}
                </span>
              </div>
              <div className="col-span-3 md:col-span-2">
                <span className={`label text-[9px] px-1.5 py-0.5 border ${
                  task.status === "done" ? "border-accent/50 text-accent" :
                  task.status === "in-progress" ? "border-amber-400/50 text-amber-400" :
                  "border-line-soft text-ink-dim"
                }`}>
                  {task.status === "done" ? "DONE" : task.status === "in-progress" ? "IN PROGRESS" : "TODO"}
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
      </div>
    </section>
  );
}