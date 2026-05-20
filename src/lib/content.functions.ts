import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";
import { deleteMediaByUrl, uploadDataUrlToMedia } from "@/lib/content-media.server";

const ADMIN_PASSKEY = "5309";

export const loadSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("site_content")
    .select("content")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return { json: data?.content ? JSON.stringify(data.content) : null };
});

export const saveSiteContent = createServerFn({ method: "POST" })
  .inputValidator((input: { passkey: string; json: string }) => {
    if (!input || typeof input.passkey !== "string" || typeof input.json !== "string") {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    if (data.passkey !== ADMIN_PASSKEY) throw new Error("Unauthorized");
    const parsed = JSON.parse(data.json) as Json;
    const { error } = await supabaseAdmin
      .from("site_content")
      .upsert({ id: 1, content: parsed, updated_at: new Date().toISOString() });
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
    return uploadDataUrlToMedia(data.fileName, data.dataUrl);
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .inputValidator((input: { passkey: string; url: string }) => {
    if (!input || typeof input.passkey !== "string" || typeof input.url !== "string") {
      throw new Error("Invalid input");
    }
    return input;
  })
  .handler(async ({ data }) => {
    if (data.passkey !== ADMIN_PASSKEY) throw new Error("Unauthorized");
    return deleteMediaByUrl(data.url);
  });

export const replaceMedia = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { passkey: string; currentUrl: string; fileName: string; dataUrl: string }) => {
      if (!input || typeof input.passkey !== "string") throw new Error("Invalid input");
      if (typeof input.currentUrl !== "string") throw new Error("Invalid current media");
      if (!input.dataUrl?.startsWith("data:")) throw new Error("Invalid file");
      return input;
    },
  )
  .handler(async ({ data }) => {
    if (data.passkey !== ADMIN_PASSKEY) throw new Error("Unauthorized");
    const uploaded = await uploadDataUrlToMedia(data.fileName, data.dataUrl);
    if (data.currentUrl) await deleteMediaByUrl(data.currentUrl);
    return uploaded;
  });
