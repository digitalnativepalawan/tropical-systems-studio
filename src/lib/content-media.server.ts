import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MEDIA_BUCKET = "media";

function mediaPathFromUrl(value: string) {
  if (!value) return null;

  try {
    const url = new URL(value);
    const publicMarker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
    const signedMarker = `/storage/v1/object/sign/${MEDIA_BUCKET}/`;
    const marker = url.pathname.includes(publicMarker) ? publicMarker : signedMarker;
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
}

export async function uploadDataUrlToMedia(fileName: string, dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");

  const [, contentType, b64] = match;
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const ext = (contentType.split("/")[1] ?? "bin").replace(/[^a-z0-9]/gi, "") || "bin";
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) || "upload";
  const baseName = safeName.replace(/\.[^.]+$/, "") || "upload";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, bytes, { contentType, upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteMediaByUrl(url: string) {
  const path = mediaPathFromUrl(url);
  if (!path) return { deleted: false, skipped: true };

  const { error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
  return { deleted: true, skipped: false, path };
}