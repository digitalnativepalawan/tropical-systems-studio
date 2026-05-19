import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSKEY = "5309";

export const loadSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("content")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { content: (data?.content ?? null) as Record<string, unknown> | null };
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input: { passkey: string; content: unknown }) => {
    if (!input || typeof input.passkey !== "string") throw new Error("Invalid input");
    return input;
  })
  .handler(async ({ data }) => {
    if (data.passkey !== ADMIN_PASSKEY) throw new Error("Unauthorized");
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, content: data.content as object, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { passkey: string; fileName: string; dataUrl: string }) => {
      if (!input || typeof input.passkey !== "string") throw new Error("Invalid input");
      if (!input.dataUrl?.startsWith("data:")) throw new Error("Invalid file");
      return input;
    },
  )
  .handler(async ({ data }) => {
    if (data.passkey !== ADMIN_PASSKEY) throw new Error("Unauthorized");
    const match = data.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid data URL");
    const [, contentType, b64] = match;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const ext = (contentType.split("/")[1] ?? "bin").replace(/[^a-z0-9]/gi, "");
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}.${ext}`;
    const { error } = await supabaseAdmin.storage
      .from("media")
      .upload(path, bytes, { contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("media").getPublicUrl(path);
    return { url: pub.publicUrl };
  });
