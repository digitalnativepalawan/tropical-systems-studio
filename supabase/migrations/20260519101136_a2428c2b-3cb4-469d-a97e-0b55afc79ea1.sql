
-- Singleton table holding the entire site content as JSON
CREATE TABLE public.site_content (
  id INT PRIMARY KEY DEFAULT 1,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_content_singleton CHECK (id = 1)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read access (the site is public)
CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

-- No public write policies. Writes happen via service-role from server functions
-- authenticated by the admin passkey.

-- Media storage bucket (public read for displaying images on the site)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view media files
CREATE POLICY "Media is publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Uploads happen via service-role from the admin server function, so no public
-- INSERT/UPDATE/DELETE policies are needed.
