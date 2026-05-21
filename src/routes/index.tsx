import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowUpRight, Github, Instagram, Linkedin, Twitter, Triangle, Mail, Globe, Building2, X } from "lucide-react";
import { useContent, type BlogPost, type PortfolioItem } from "@/store/content";
import { AdminTrigger } from "@/components/AdminPanel";
import mqLogo from "@/assets/mq-logo.png";
import HermesAgentSection from "@/components/HermesAgentSection";

export const Route = createFileRoute("/")({ component: Index });

function MQLogo({ className = "" }: { className?: string }) {
  return <img src={mqLogo} alt="MQ" className={className} />;
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

function Header() {
  const { content } = useContent();
  const h = content.header;
  return (
    <>
    <header className="grid grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 lg:px-10 pt-5 md:pt-6 pb-4 text-[10px] uppercase tracking-[0.14em]">
      <div className="col-span-8 md:col-span-4">
        <Link to="/" className="hover:text-accent transition-colors">
          <div className="text-ink">{h.brand}</div>
          <div className="text-ink-mute mt-0.5 text-[9px] md:text-[10px]">{h.tagline}</div>
        </Link>
      </div>
      <div className="col-span-4 md:hidden flex justify-end">
        <MQLogo className="w-9 h-auto" />
      </div>
      <div className="hidden md:flex col-span-6 md:col-span-4 items-start justify-center gap-6">
        <span className="text-ink border-b border-ink">HOME</span>
        <Link to="/agents" className="text-ink-dim hover:text-accent transition-colors">OPERATORS</Link>
      </div>
      <div className="col-span-6 md:col-span-3 md:text-right">
        <div className="text-ink flex md:justify-end items-center gap-1.5">{h.rightLine1}<Dot /></div>
        <div className="text-ink-mute mt-0.5">{h.rightLine2}</div>
      </div>
      <div className="hidden md:flex col-span-1 justify-end">
        <MQLogo className="w-12 h-auto" />
      </div>
    </header>
    </>
  );
}

function Hero() {
  const { content } = useContent();
  const h = content.hero;
  return (
    <section className="px-4 md:px-6 lg:px-10">
      <div className="corner border border-line relative overflow-hidden">
        <div className="c1" /><div className="c2" />
        <div className="relative aspect-[3/4] sm:aspect-[16/10] md:aspect-[16/8]">
          <img src={h.image} alt="Palawan sunset" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background/70" />

          {/* mobile-only minimal top meta */}
          <div className="md:hidden absolute top-3 left-3 right-3 flex items-start justify-between text-[9px] uppercase tracking-[0.14em]">
            <div className="space-y-0.5">
              <div className="text-ink">{h.asset}</div>
              <div className="text-ink-dim">{h.environment}</div>
            </div>
            <div className="text-right space-y-0.5">
              <div className="text-accent">{h.statusValue}</div>
              <div className="text-ink-dim flex items-center justify-end gap-1">LIVE <Dot /></div>
            </div>
          </div>

          {/* desktop left meta */}
          <div className="hidden md:block absolute top-4 left-4 text-[10px] uppercase tracking-[0.14em] space-y-0.5">
            <div className="text-ink">{h.asset}</div>
            <div className="text-ink-dim">{h.process}</div>
            <div className="text-ink-dim">{h.environment}</div>
            <div className="text-ink-dim">{h.status}<span className="text-accent">{h.statusValue}</span></div>
          </div>

          {/* desktop left ladder */}
          <div className="hidden md:block absolute top-1/3 left-4 text-[10px] uppercase tracking-[0.14em] space-y-1">
            {["01","02","03","04","05"].map((n) => (
              <div key={n} className={n==="03"?"text-accent":"text-ink-mute"}>{n}</div>
            ))}
          </div>

          {/* desktop coords */}
          <div className="hidden md:block absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.14em] space-y-0.5 text-ink-dim">
            <div className="text-ink-mute mb-2">— · — · —</div>
            <div>{h.coordN}</div>
            <div>{h.coordE}</div>
            <div>{h.elev}</div>
          </div>

          {/* desktop status box */}
          <div className="hidden md:block absolute top-4 right-4 text-[10px] uppercase tracking-[0.14em] border border-line-soft p-2 min-w-[180px]">
            <div className="mb-1.5"><span className="text-accent">SYSTEM</span> <span className="text-ink-dim">STATUS</span></div>
            <div className="space-y-0.5 text-ink-dim">
              <div className="flex justify-between"><span>NETWORK</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>OPERATIONS</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>DATABASE</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>SYNC</span><span className="text-ink">: ONLINE</span></div>
            </div>
          </div>

          {/* desktop build log */}
          <div className="hidden md:block absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.14em] border border-line-soft p-2 min-w-[180px]">
            <div className="text-accent mb-1">{h.buildLog}</div>
            <div className="text-ink-dim">{h.deployed}</div>
            <div className="text-ink-dim mb-2">{h.deployedDate}</div>
            <div className="flex justify-between items-center pt-2 border-t border-line-soft">
              <div>
                <div className="text-ink-dim">{h.systems}</div>
                <div className="text-ink flex items-center gap-1">ONLINE <Dot /></div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-ink-dim" />
            </div>
          </div>

          {/* mobile bottom coords */}
          <div className="md:hidden absolute bottom-3 left-3 right-3 flex items-end justify-between text-[9px] uppercase tracking-[0.14em] text-ink-dim">
            <div className="space-y-0.5">
              <div>{h.coordN}</div>
              <div>{h.coordE}</div>
            </div>
            <div className="text-right text-accent">{h.buildLog}</div>
          </div>

          {/* center title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <MQLogo className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto mb-4 md:mb-6" />
            <div className="label text-[9px] md:text-[10px] mb-2 md:mb-3">{h.overline}</div>
            <h1 className="font-serif text-4xl xs:text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-ink leading-[0.95]">{h.title}</h1>
            <div className="mt-4 md:mt-6 text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              <div>{h.subtitle1}</div>
              <div>{h.subtitle2}</div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile-only stacked status + build log below image */}
      <div className="md:hidden mt-3 grid grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.14em]">
        <div className="border border-line-soft p-2.5">
          <div className="mb-1.5"><span className="text-accent">SYSTEM</span> <span className="text-ink-dim">STATUS</span></div>
          <div className="space-y-0.5 text-ink-dim">
            <div className="flex justify-between"><span>NETWORK</span><span className="text-ink">ONLINE</span></div>
            <div className="flex justify-between"><span>OPS</span><span className="text-ink">ONLINE</span></div>
            <div className="flex justify-between"><span>DB</span><span className="text-ink">ONLINE</span></div>
            <div className="flex justify-between"><span>SYNC</span><span className="text-ink">ONLINE</span></div>
          </div>
        </div>
        <div className="border border-line-soft p-2.5">
          <div className="text-accent mb-1">{h.buildLog}</div>
          <div className="text-ink-dim">{h.deployed}</div>
          <div className="text-ink-dim mb-2">{h.deployedDate}</div>
          <div className="flex justify-between items-center pt-2 border-t border-line-soft">
            <div>
              <div className="text-ink-dim">{h.systems}</div>
              <div className="text-ink flex items-center gap-1">ONLINE <Dot /></div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-ink-dim" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, onOpen }: { post: BlogPost; onOpen: (p: BlogPost) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(post)}
      className="group corner border border-line block relative text-left w-full cursor-pointer"
    >
      <div className="c1" /><div className="c2" />
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.videoUrl && /youtube|youtu\.be/.test(post.videoUrl) ? (
          <iframe src={post.videoUrl.replace("watch?v=", "embed/")} className="absolute inset-0 w-full h-full" />
        ) : post.videoUrl ? (
          <video src={post.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline autoPlay />
        ) : (
          <img src={post.image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-background/30" />
        <div className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.14em] text-accent">{post.category}</div>
        <div className="absolute top-3 right-3 text-[10px] uppercase tracking-[0.14em] text-right text-ink-dim leading-relaxed">
          <div>{post.meta1}</div>
          <div>{post.meta2}</div>
          <div>{post.meta3}</div>
        </div>
      </div>
      <div className="p-4 border-t border-line">
        <div className="label mb-2">{post.date}</div>
        <div className="flex justify-between items-end gap-4">
          <h3 className="font-serif text-xl md:text-2xl text-ink leading-snug whitespace-pre-line">{post.title}</h3>
          <ArrowUpRight className="w-4 h-4 text-accent shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </button>
  );
}

function BlogReader({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const paragraphs = (post.content || post.excerpt || "Full story coming soon.").split(/\n+/).filter(Boolean);

  return (
    <div className="fixed inset-0 z-[120] bg-background/95 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-background/95 px-4 py-3 sm:px-6 md:px-10">
        <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim flex items-center gap-3">
          <span className="text-accent">/ BLOG</span>
          <span className="hidden sm:inline">{post.category}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close article"
          className="flex items-center gap-2 border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-ink hover:border-accent hover:text-accent"
        >
          <X className="h-3.5 w-3.5" /> Close
        </button>
      </div>

      <article className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim flex flex-wrap gap-x-4 gap-y-1 mb-4">
          <span className="text-accent">{post.category}</span>
          <span>{post.date}</span>
          {post.author && <span>{post.author}</span>}
          {post.readTime && <span>{post.readTime}</span>}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.05] whitespace-pre-line mb-6">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-ink-dim text-base sm:text-lg leading-relaxed mb-8 border-l-2 border-accent pl-4">
            {post.excerpt}
          </p>
        )}
        <div className="corner border border-line relative overflow-hidden mb-8">
          <div className="c1" /><div className="c2" />
          <img src={post.image} alt="" className="w-full h-auto object-cover aspect-[16/9]" />
        </div>
        <div className="space-y-5 text-ink text-[15px] sm:text-base leading-[1.75] font-light">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="mt-12 pt-6 border-t border-line flex items-center justify-between text-[10px] uppercase tracking-[0.14em] text-ink-dim">
          <span>END OF ARTICLE</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 border border-line px-3 py-1.5 text-ink hover:border-accent hover:text-accent"
          >
            <X className="h-3.5 w-3.5" /> Back to site
          </button>
        </div>
      </article>
    </div>
  );
}

function Blog() {
  const { content } = useContent();
  const [active, setActive] = useState<BlogPost | null>(null);
  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="flex items-end justify-between mb-4 border-t border-line pt-4">
        <div>
          <div className="label">/ BLOG</div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{content.blogTitle}</h2>
        </div>
        <button type="button" onClick={() => setActive(content.blog[0] ?? null)} className="label flex items-center gap-1 hover:text-accent">{content.blogCta} <ArrowUpRight className="w-3 h-3 text-accent" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.blog.map((p) => <BlogCard key={p.id} post={p} onOpen={setActive} />)}
      </div>
      {active && <BlogReader post={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function Row({ item }: { item: PortfolioItem }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        setZoomed(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen]);

  return (
    <>
      <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-start py-4 border-b border-line text-[11px] uppercase tracking-[0.1em]">
        {/* Index */}
        <div className="col-span-1 text-ink-mute pt-1">{item.index}</div>

        {/* Thumb */}
        <div className="col-span-2 lg:col-span-1">
          <button
            type="button"
            onClick={() => { setLightboxOpen(true); setZoomed(false); }}
            className="w-full aspect-[4/3] max-w-[88px] overflow-hidden border border-line-soft p-0 bg-transparent text-left cursor-pointer hover:border-accent transition-colors"
          >
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
          </button>
        </div>

        {/* Name + category */}
        <div className="col-span-9 lg:col-span-2">
          <div className="text-ink">{item.name}</div>
          <div className="text-ink-mute mt-0.5 leading-snug">{item.category}</div>
          <div className="inline-block mt-1.5 px-1.5 py-0.5 border border-line-soft text-[9px] text-ink-dim">{item.tag}</div>
        </div>

        {/* Description — tablet+ */}
        <div className="hidden md:block col-span-12 lg:col-span-3 md:col-start-4 lg:col-start-auto text-ink-dim normal-case tracking-normal text-[11px] leading-relaxed pt-1">
          {item.description}
        </div>

        {/* Status */}
        <div className="hidden md:flex col-span-3 lg:col-span-1 items-start gap-1.5 pt-1">
          <Dot className="mt-1" />
          <div className="whitespace-pre-line text-ink leading-tight">{item.status}</div>
        </div>

        {/* Deployed */}
        <div className="hidden md:block col-span-3 lg:col-span-1 text-ink-dim pt-1">
          <div>{item.deployedDate}</div>
          <div>{item.deployedVersion}</div>
        </div>

        {/* Environment */}
        <div className="hidden md:block col-span-3 lg:col-span-1 text-ink-dim pt-1">
          <div>{item.environment}</div>
          <div>{item.environmentLoc}</div>
        </div>

        {/* Role */}
        <div className="hidden md:block col-span-3 lg:col-span-1 text-ink-dim pt-1">
          <div>{item.role}</div>
          <div>{item.roleType}</div>
        </div>

        {/* Link */}
        <div className="col-span-12 md:col-span-12 lg:col-span-1 flex items-center md:justify-start lg:justify-end gap-1 pt-1 md:pt-2 lg:pt-1 md:col-start-4 lg:col-start-auto">
          <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline truncate">{item.link}</a>
          <ArrowUpRight className="w-3 h-3 text-accent shrink-0" />
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setLightboxOpen(false);
              setZoomed(false);
            }
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-line/30 shrink-0">
            <div className="text-[10px] uppercase tracking-[0.14em] text-ink-dim">
              <span className="text-accent">{item.index}</span> <span className="text-ink">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed(z => !z)}
                className="label px-3 py-1.5 border border-line-soft text-ink-dim hover:border-accent hover:text-accent transition-colors"
              >
                {zoomed ? "ZOOM OUT" : "ZOOM IN"}
              </button>
              <button
                type="button"
                onClick={() => { setLightboxOpen(false); setZoomed(false); }}
                className="label px-3 py-1.5 border border-line-soft text-ink-dim hover:border-accent hover:text-accent transition-colors"
              >
                CLOSE
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto flex items-start justify-center p-4 md:p-8">
            <img
              src={item.image}
              alt={item.name}
              onClick={() => setZoomed(z => !z)}
              className="block transition-all duration-500 ease-out"
              style={{
                cursor: zoomed ? "zoom-out" : "zoom-in",
                maxWidth: zoomed ? "none" : "85vw",
                maxHeight: zoomed ? "none" : "75vh",
                width: "auto",
                height: "auto",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function Portfolio() {
  const { content } = useContent();
  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="border-t border-line pt-4">
        <div className="grid grid-cols-12 gap-3 items-end pb-4">
          <div className="col-span-12 lg:col-span-4">
            <div className="label">/ PORTFOLIO</div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{content.portfolioTitle}</h2>
          </div>
          <div className="hidden lg:block col-span-3 text-[11px] uppercase tracking-[0.1em] text-ink-dim leading-relaxed">
            <div>{content.portfolioSub1}</div>
            <div>{content.portfolioSub2}</div>
            <div>{content.portfolioSub3}</div>
          </div>
          <div className="hidden lg:grid col-span-5 grid-cols-5 gap-3 text-[10px] uppercase tracking-[0.14em] text-ink-mute">
            <div>STATUS</div><div>DEPLOYED</div><div>ENVIRONMENT</div><div>ROLE</div><div className="text-right">LINK</div>
          </div>
        </div>
        <div className="border-t border-line">
          {content.portfolio.map((p) => <Row key={p.id} item={p} />)}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { content } = useContent();
  const f = content.footer;
  return (
    <footer className="px-6 lg:px-10 pt-12 pb-6 mt-12 border-t border-line">
      <div className="grid grid-cols-12 gap-4 items-center text-[10px] uppercase tracking-[0.14em]">
        <div className="col-span-12 md:col-span-3">
          <div className="text-ink">{f.brand}</div>
          <div className="text-ink-mute mt-0.5">{f.tagline}</div>
        </div>
        <div className="col-span-4 md:col-span-2 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-ink-dim" />
          <div><div className="text-ink-dim">{f.col1Label}</div><div className="text-ink">{f.col1Value}</div></div>
        </div>
        <div className="col-span-4 md:col-span-2 flex items-center gap-2">
          <Globe className="w-4 h-4 text-ink-dim" />
          <div><div className="text-ink-dim">{f.col2Label}</div><div className="text-ink">{f.col2Value}</div></div>
        </div>
        <div className="col-span-4 md:col-span-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-ink-dim" />
          <div><div className="text-ink-dim">{f.col3Label}</div><div className="text-ink flex items-center gap-1">{f.col3Value} <ArrowUpRight className="w-3 h-3 text-accent" /></div></div>
        </div>
        <div className="col-span-12 md:col-span-3 md:text-right">
          <div className="text-ink">{f.copyright}</div>
          <div className="text-ink-mute mt-0.5">{f.rights}</div>
        </div>
      </div>
      <div className="flex gap-4 mt-6 text-ink-mute">
        {[Github, Triangle, Instagram, Twitter, Linkedin].map((Icon, i) => (
          <a key={i} href="#" className="hover:text-accent transition-colors"><Icon className="w-4 h-4" /></a>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-[10px] uppercase tracking-[0.14em]">
        <span className="text-ink">HOME</span>
        <Link to="/agents" className="text-ink-dim hover:text-accent transition-colors">OPERATORS</Link>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background text-ink">
      <Header />
      <Hero />
      <Blog />
      <Portfolio />
      <HermesAgentSection />
      <Footer />
      <AdminTrigger />
    </main>
  );
}
