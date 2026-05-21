import { useEffect, useRef, useState } from "react";
import { LockKeyhole, X } from "lucide-react";
import { defaultContent, useContent, type Content } from "@/store/content";
import { deleteMedia, uploadMedia } from "@/lib/content.functions";

const ADMIN_PASSKEY = "5309";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function uploadFile(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  const res = await uploadMedia({
    data: { passkey: ADMIN_PASSKEY, fileName: file.name, dataUrl },
  });
  return res.url;
}

function Field({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <label className="block">
      <span className="label block mb-1">{label}</span>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-background border border-line p-2 text-ink font-mono text-[11px] focus:border-accent outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-background border border-line p-2 text-ink font-mono text-[11px] focus:border-accent outline-none"
        />
      )}
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onDelete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="block">
      <span className="label block mb-1">{label}</span>
      <div className="flex gap-2 items-center">
        {value && <img src={value} alt="" className="w-12 h-12 object-cover border border-line" />}
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={async (e) => {
            const input = e.currentTarget;
            const f = input?.files?.[0];
            if (!f) return;
            setBusy(true);
            try {
              const url = await uploadFile(f);
              await onChange(url);
            } catch (err) {
              alert("Upload failed: " + (err instanceof Error ? err.message : "unknown"));
            } finally {
              setBusy(false);
              // Reset so the same file can be re-selected; guard against unmount.
              if (input && input.isConnected) {
                try { input.value = ""; } catch { /* ignore */ }
              }
            }
          }}
          className="text-[10px] text-ink-dim"
        />
        {value && onDelete && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm("Delete this image from storage and remove it from the site?")) return;
              setBusy(true);
              try {
                await onDelete();
              } catch (err) {
                alert("Delete failed: " + (err instanceof Error ? err.message : "unknown"));
              } finally {
                setBusy(false);
              }
            }}
            className="label border border-line px-2 py-1 text-accent hover:border-accent disabled:opacity-50"
          >
            DELETE IMAGE
          </button>
        )}
        {busy && <span className="label text-ink-dim">SYNCING...</span>}
      </div>
    </label>
  );
}

export function AdminPanel({ onClose }: { onClose: () => void }) {
  const { content, save, saving, reset } = useContent();
  const [c, setC] = useState<Content>(content);
  const [tab, setTab] = useState<"header" | "hero" | "blog" | "portfolio" | "footer">("header");
  const [err, setErr] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const lastSavedJson = useRef(JSON.stringify(content));

  useEffect(() => {
    const incomingJson = JSON.stringify(content);
    setC((current) => (JSON.stringify(current) === lastSavedJson.current ? content : current));
    lastSavedJson.current = incomingJson;
  }, [content]);

  useEffect(() => {
    const json = JSON.stringify(c);
    if (json === lastSavedJson.current) return;
    const timer = window.setTimeout(async () => {
      if (json === lastSavedJson.current) return;
      setErr(null);
      setSyncing(true);
      try {
        await save(ADMIN_PASSKEY, c);
        lastSavedJson.current = json;
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Auto-save failed");
      } finally {
        setSyncing(false);
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [c, save]);

  const handleSave = async () => {
    setErr(null);
    try {
      await save(ADMIN_PASSKEY, c);
      lastSavedJson.current = JSON.stringify(c);
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    }
  };

  const upd = <K extends keyof Content>(key: K, value: Content[K]) => setC({ ...c, [key]: value });

  const commit = async (next: Content, mediaUrlToDelete?: string) => {
    setErr(null);
    setC(next);
    setSyncing(true);
    try {
      await save(ADMIN_PASSKEY, next);
      lastSavedJson.current = JSON.stringify(next);
      if (mediaUrlToDelete) {
        await deleteMedia({ data: { passkey: ADMIN_PASSKEY, url: mediaUrlToDelete } });
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sync failed");
      throw e;
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-[100] overflow-auto">
      <div className="max-w-5xl mx-auto p-6 corner border border-line my-6 bg-surface">
        <div className="c1" />
        <div className="c2" />
        <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
          <div>
            <div className="label">/ADMIN/CMS</div>
            <h2 className="font-serif text-2xl text-ink">Content Editor</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                reset();
                void commit(defaultContent);
              }}
              disabled={saving || syncing}
              className="label px-3 py-2 border border-line hover:border-accent"
            >
              RESET
            </button>
            <button
              onClick={onClose}
              className="label px-3 py-2 border border-line hover:border-accent"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              disabled={saving || syncing}
              className="label px-3 py-2 bg-accent text-white border border-accent disabled:opacity-50"
            >
              {saving || syncing ? "SYNCING..." : "SAVE"}
            </button>
          </div>
        </div>
        {err && <div className="label text-accent mb-3">ERROR: {err}</div>}
        {!err && syncing && <div className="label text-ink-dim mb-3">SYNCING TO BACKEND...</div>}

        <div className="flex gap-1 mb-4 border-b border-line">
          {(["header", "hero", "blog", "portfolio", "footer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`label px-3 py-2 ${tab === t ? "text-accent border-b border-accent -mb-px" : "text-ink-dim"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "header" && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(c.header).map(([k, v]) => (
              <Field
                key={k}
                label={k}
                value={v}
                onChange={(nv) => upd("header", { ...c.header, [k]: nv })}
              />
            ))}
          </div>
        )}

        {tab === "hero" && (
          <div className="grid grid-cols-2 gap-3">
            <ImageField
              label="background image"
              value={c.hero.image}
              onChange={(nv) => commit({ ...c, hero: { ...c.hero, image: nv } }, c.hero.image)}
              onDelete={() => commit({ ...c, hero: { ...c.hero, image: "" } }, c.hero.image)}
            />
            {Object.entries(c.hero)
              .filter(([k]) => k !== "image")
              .map(([k, v]) => (
                <Field
                  key={k}
                  label={k}
                  value={v as string}
                  onChange={(nv) => upd("hero", { ...c.hero, [k]: nv })}
                />
              ))}
          </div>
        )}

        {tab === "blog" && (
          <div className="space-y-4">
            <Field
              label="section title"
              value={c.blogTitle}
              onChange={(v) => upd("blogTitle", v)}
            />
            <Field label="CTA label" value={c.blogCta} onChange={(v) => upd("blogCta", v)} />
            {c.blog.map((post, i) => (
              <div key={post.id} className="border border-line p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="label">POST {i + 1}</span>
                  <button
                    onClick={() => {
                      const next = { ...c, blog: c.blog.filter((_, j) => j !== i) };
                      void commit(next, post.image);
                    }}
                    className="label text-accent"
                  >
                    DELETE
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ImageField
                    label="image"
                    value={post.image}
                    onChange={(nv) =>
                      commit(
                        { ...c, blog: c.blog.map((p, j) => (j === i ? { ...p, image: nv } : p)) },
                        post.image,
                      )
                    }
                    onDelete={() =>
                      commit(
                        { ...c, blog: c.blog.map((p, j) => (j === i ? { ...p, image: "" } : p)) },
                        post.image,
                      )
                    }
                  />
                  <Field
                    label="video URL (mp4 or YouTube)"
                    value={post.videoUrl || ""}
                    onChange={(nv) =>
                      upd(
                        "blog",
                        c.blog.map((p, j) => (j === i ? { ...p, videoUrl: nv } : p)),
                      )
                    }
                  />
                  {(["category", "meta1", "meta2", "meta3", "date", "author", "readTime", "link"] as const).map((k) => (
                    <Field
                      key={k}
                      label={k}
                      value={(post[k] as string) || ""}
                      onChange={(nv) =>
                        upd(
                          "blog",
                          c.blog.map((p, j) => (j === i ? { ...p, [k]: nv } : p)),
                        )
                      }
                    />
                  ))}
                  <div className="col-span-2">
                    <Field
                      area
                      label="title"
                      value={post.title}
                      onChange={(nv) =>
                        upd(
                          "blog",
                          c.blog.map((p, j) => (j === i ? { ...p, title: nv } : p)),
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Field
                      area
                      label="excerpt (short summary shown at top of article)"
                      value={post.excerpt || ""}
                      onChange={(nv) =>
                        upd(
                          "blog",
                          c.blog.map((p, j) => (j === i ? { ...p, excerpt: nv } : p)),
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block">
                      <span className="label block mb-1">full story (blank line separates paragraphs)</span>
                      <textarea
                        value={post.content || ""}
                        onChange={(e) =>
                          upd(
                            "blog",
                            c.blog.map((p, j) => (j === i ? { ...p, content: e.target.value } : p)),
                          )
                        }
                        rows={14}
                        className="w-full bg-background border border-line p-2 text-ink font-mono text-[11px] focus:border-accent outline-none leading-relaxed"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const next = {
                  ...c,
                  blog: [
                  ...c.blog,
                  {
                    id: String(Date.now()),
                    category: "NEW",
                    meta1: "",
                    meta2: "",
                    meta3: "",
                    date: "",
                    title: "New post",
                    image: "",
                  },
                  ],
                };
                void commit(next);
              }}
              className="label px-3 py-2 border border-line hover:border-accent"
            >
              + ADD POST
            </button>
          </div>
        )}

        {tab === "portfolio" && (
          <div className="space-y-4">
            <Field
              label="section title"
              value={c.portfolioTitle}
              onChange={(v) => upd("portfolioTitle", v)}
            />
            {c.portfolio.map((item, i) => (
              <div key={item.id} className="border border-line p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="label">
                    {item.index} — {item.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={i === 0}
                      onClick={() => {
                        const arr = [...c.portfolio];
                        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                        void commit({ ...c, portfolio: arr });
                      }}
                      className="label disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      disabled={i === c.portfolio.length - 1}
                      onClick={() => {
                        const arr = [...c.portfolio];
                        [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
                        void commit({ ...c, portfolio: arr });
                      }}
                      className="label disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => {
                        const next = { ...c, portfolio: c.portfolio.filter((_, j) => j !== i) };
                        void commit(next, item.image);
                      }}
                      className="label text-accent"
                    >
                      DELETE
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ImageField
                    label="image"
                    value={item.image}
                    onChange={(nv) =>
                      commit(
                        { ...c, portfolio: c.portfolio.map((p, j) => (j === i ? { ...p, image: nv } : p)) },
                        item.image,
                      )
                    }
                    onDelete={() =>
                      commit(
                        { ...c, portfolio: c.portfolio.map((p, j) => (j === i ? { ...p, image: "" } : p)) },
                        item.image,
                      )
                    }
                  />
                  {(
                    [
                      "index",
                      "name",
                      "category",
                      "tag",
                      "status",
                      "deployedDate",
                      "deployedVersion",
                      "environment",
                      "environmentLoc",
                      "role",
                      "roleType",
                      "link",
                      "url",
                    ] as const
                  ).map((k) => (
                    <Field
                      key={k}
                      label={k}
                      value={item[k] as string}
                      onChange={(nv) =>
                        upd(
                          "portfolio",
                          c.portfolio.map((p, j) => (j === i ? { ...p, [k]: nv } : p)),
                        )
                      }
                    />
                  ))}
                  <div className="col-span-2">
                    <Field
                      area
                      label="description"
                      value={item.description}
                      onChange={(nv) =>
                        upd(
                          "portfolio",
                          c.portfolio.map((p, j) => (j === i ? { ...p, description: nv } : p)),
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const next = {
                  ...c,
                  portfolio: [
                    ...c.portfolio,
                    {
                      id: String(Date.now()),
                      index: String(c.portfolio.length + 1).padStart(2, "0"),
                      image: "",
                      name: "NEW.APP",
                      category: "CATEGORY",
                      tag: "TAG",
                      description: "",
                      status: "LIVE\nACTIVE",
                      deployedDate: "",
                      deployedVersion: "",
                      environment: "CLOUD",
                      environmentLoc: "",
                      role: "FOUNDER",
                      roleType: "FULLSTACK",
                      link: "",
                      url: "",
                    },
                  ],
                };
                void commit(next);
              }}
              className="label px-3 py-2 border border-line hover:border-accent"
            >
              + ADD APP
            </button>
          </div>
        )}

        {tab === "footer" && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(c.footer).map(([k, v]) => (
              <Field
                key={k}
                label={k}
                value={v}
                onChange={(nv) => upd("footer", { ...c.footer, [k]: nv })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminTrigger() {
  const [open, setOpen] = useState(false);
  const [askKey, setAskKey] = useState(false);
  const [val, setVal] = useState("");
  const [error, setError] = useState(false);

  const unlock = () => {
    if (val === ADMIN_PASSKEY) {
      setOpen(true);
      setAskKey(false);
      setVal("");
      setError(false);
      return;
    }
    setVal("");
    setError(true);
  };

  const closePasskey = () => {
    setAskKey(false);
    setVal("");
    setError(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setAskKey(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="Open admin login"
        onClick={() => {
          setAskKey(true);
          setError(false);
        }}
        className="fixed bottom-4 right-4 z-50 flex h-10 items-center gap-2 border border-line bg-surface/95 px-3 text-[10px] uppercase tracking-[0.14em] text-ink shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur hover:border-accent hover:text-accent sm:bottom-5 sm:right-5"
      >
        <LockKeyhole className="h-3.5 w-3.5" />
        <span>Admin Login</span>
      </button>
      {askKey && (
        <div className="fixed inset-0 bg-background/92 z-[200] flex items-center justify-center px-4">
          <div className="corner border border-line p-5 sm:p-6 bg-surface w-full max-w-[340px] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="c1" />
            <div className="c2" />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="label mb-1">/ADMIN/LOGIN</div>
                <h2 className="font-serif text-2xl leading-none text-ink">Access Passkey</h2>
              </div>
              <button
                type="button"
                aria-label="Close admin login"
                onClick={closePasskey}
                className="border border-line-soft p-2 text-ink-dim hover:border-accent hover:text-accent"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              type="password"
              autoFocus
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  unlock();
                }
                if (e.key === "Escape") closePasskey();
              }}
              className={`w-full bg-background border p-3 text-ink font-mono text-lg tracking-[0.4em] outline-none focus:border-accent ${error ? "border-accent" : "border-line"}`}
              placeholder="••••"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className={`label ${error ? "text-accent" : "label-mute"}`}>
                {error ? "INVALID PASSKEY" : "PASSKEY REQUIRED"}
              </div>
              <button
                type="button"
                onClick={unlock}
                className="label border border-accent bg-accent px-3 py-2 text-background hover:bg-accent-dim"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
      {open && <AdminPanel onClose={() => setOpen(false)} />}
    </>
  );
}
