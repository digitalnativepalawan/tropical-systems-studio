import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Github, Instagram, Linkedin, Twitter, Triangle, Mail, Globe, Building2 } from "lucide-react";
import { useContent, type BlogPost, type PortfolioItem } from "@/store/content";
import { AdminTrigger } from "@/components/AdminPanel";

export const Route = createFileRoute("/")({ component: Index });

function MQLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} fill="none" aria-hidden>
      <path d="M2 58 L2 8 L22 8 L22 58" stroke="currentColor" strokeWidth="6" />
      <path d="M28 58 L28 8 L48 8 L48 58" stroke="currentColor" strokeWidth="6" />
      <path d="M54 58 L54 8 L74 8 L74 58" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}

function Dot({ className = "" }: { className?: string }) {
  return <span className={`inline-block w-1.5 h-1.5 rounded-full bg-accent ${className}`} />;
}

function Header() {
  const { content } = useContent();
  const h = content.header;
  return (
    <header className="grid grid-cols-12 gap-4 px-6 lg:px-10 pt-6 pb-4 text-[10px] uppercase tracking-[0.14em]">
      <div className="col-span-12 md:col-span-4">
        <div className="text-ink">{h.brand}</div>
        <div className="text-ink-mute mt-0.5">{h.tagline}</div>
      </div>
      <div className="col-span-6 md:col-span-3">
        <div className="text-ink">{h.centerLine1}</div>
        <div className="text-ink-mute mt-0.5">{h.centerLine2}</div>
      </div>
      <div className="col-span-6 md:col-span-3 md:text-right">
        <div className="text-ink flex md:justify-end items-center gap-1.5">{h.rightLine1}<Dot /></div>
        <div className="text-ink-mute mt-0.5">{h.rightLine2}</div>
      </div>
      <div className="hidden md:flex col-span-2 justify-end">
        <MQLogo className="w-10 h-7 text-accent" />
      </div>
    </header>
  );
}

function Hero() {
  const { content } = useContent();
  const h = content.hero;
  return (
    <section className="px-6 lg:px-10">
      <div className="corner border border-line relative overflow-hidden">
        <div className="c1" /><div className="c2" />
        <div className="relative aspect-[16/9] md:aspect-[16/8]">
          <img src={h.image} alt="Palawan sunset" className="absolute inset-0 w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/60" />

          {/* left meta */}
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.14em] space-y-0.5">
            <div className="text-ink">{h.asset}</div>
            <div className="text-ink-dim">{h.process}</div>
            <div className="text-ink-dim">{h.environment}</div>
            <div className="text-ink-dim">{h.status}<span className="text-accent">{h.statusValue}</span></div>
          </div>

          {/* left ladder */}
          <div className="absolute top-1/3 left-4 text-[10px] uppercase tracking-[0.14em] space-y-1">
            {["01","02","03","04","05"].map((n) => (
              <div key={n} className={n==="03"?"text-accent":"text-ink-mute"}>{n}</div>
            ))}
          </div>

          {/* coords */}
          <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.14em] space-y-0.5 text-ink-dim">
            <div className="text-ink-mute mb-2">— · — · —</div>
            <div>{h.coordN}</div>
            <div>{h.coordE}</div>
            <div>{h.elev}</div>
          </div>

          {/* status box top right */}
          <div className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.14em] border border-line-soft p-2 min-w-[180px]">
            <div className="mb-1.5"><span className="text-accent">SYSTEM</span> <span className="text-ink-dim">STATUS</span></div>
            <div className="space-y-0.5 text-ink-dim">
              <div className="flex justify-between"><span>NETWORK</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>OPERATIONS</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>DATABASE</span><span className="text-ink">: ONLINE</span></div>
              <div className="flex justify-between"><span>SYNC</span><span className="text-ink">: ONLINE</span></div>
            </div>
          </div>

          {/* build log bottom right */}
          <div className="absolute bottom-4 right-4 text-[10px] uppercase tracking-[0.14em] border border-line-soft p-2 min-w-[180px]">
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

          {/* center title */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <MQLogo className="w-12 md:w-16 h-auto text-accent mb-3" />
            <div className="label mb-3">{h.overline}</div>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-ink leading-none">{h.title}</h1>
            <div className="mt-6 text-[10px] uppercase tracking-[0.22em] text-ink-dim">
              <div>{h.subtitle1}</div>
              <div>{h.subtitle2}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a href={post.link || "#"} className="group corner border border-line block relative">
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
    </a>
  );
}

function Blog() {
  const { content } = useContent();
  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="flex items-end justify-between mb-4 border-t border-line pt-4">
        <div>
          <div className="label">/ BLOG</div>
          <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{content.blogTitle}</h2>
        </div>
        <a href="#" className="label flex items-center gap-1 hover:text-accent">{content.blogCta} <ArrowUpRight className="w-3 h-3 text-accent" /></a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.blog.map((p) => <BlogCard key={p.id} post={p} />)}
      </div>
    </section>
  );
}

function Row({ item }: { item: PortfolioItem }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-center py-4 border-b border-line text-[11px] uppercase tracking-[0.1em]">
      <div className="col-span-1 text-ink-mute">{item.index}</div>
      <div className="col-span-2 md:col-span-1">
        <div className="w-16 h-12 md:w-20 md:h-14 overflow-hidden border border-line-soft">
          <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>
      <div className="col-span-9 md:col-span-2">
        <div className="text-ink">{item.name}</div>
        <div className="text-ink-mute mt-0.5">{item.category}</div>
        <div className="inline-block mt-1 px-1.5 py-0.5 border border-line-soft text-[9px] text-ink-dim">{item.tag}</div>
      </div>
      <div className="hidden md:block col-span-3 text-ink-dim normal-case tracking-normal text-[11px] leading-relaxed">{item.description}</div>
      <div className="hidden md:flex col-span-1 items-center gap-1.5"><Dot /><div className="whitespace-pre-line text-ink">{item.status}</div></div>
      <div className="hidden md:block col-span-1 text-ink-dim">
        <div>{item.deployedDate}</div>
        <div>{item.deployedVersion}</div>
      </div>
      <div className="hidden md:block col-span-1 text-ink-dim">
        <div>{item.environment}</div>
        <div>{item.environmentLoc}</div>
      </div>
      <div className="hidden md:block col-span-1 text-ink-dim">
        <div>{item.role}</div>
        <div>{item.roleType}</div>
      </div>
      <div className="col-span-12 md:col-span-1 flex items-center md:justify-end gap-1">
        <a href={item.url} target="_blank" rel="noreferrer" className="text-accent hover:underline">{item.link}</a>
        <ArrowUpRight className="w-3 h-3 text-accent" />
      </div>
    </div>
  );
}

function Portfolio() {
  const { content } = useContent();
  return (
    <section className="px-6 lg:px-10 pt-12 md:pt-16">
      <div className="border-t border-line pt-4">
        <div className="grid grid-cols-12 gap-3 items-end pb-4">
          <div className="col-span-12 md:col-span-4">
            <div className="label">/ PORTFOLIO</div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mt-1">{content.portfolioTitle}</h2>
          </div>
          <div className="hidden md:block col-span-3 text-[11px] uppercase tracking-[0.1em] text-ink-dim leading-relaxed">
            <div>{content.portfolioSub1}</div>
            <div>{content.portfolioSub2}</div>
            <div>{content.portfolioSub3}</div>
          </div>
          <div className="hidden md:grid col-span-5 grid-cols-5 gap-3 text-[10px] uppercase tracking-[0.14em] text-ink-mute">
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
      <Footer />
      <AdminTrigger />
    </main>
  );
}
