## What I confirmed

- The hosted backend is healthy.
- I queried the database directly: `site_content` was updated today at `2026-05-21 01:31:17 UTC`.
- I queried storage directly: the `media` bucket has 3 uploads today around `00:21–00:24 UTC`.
- The custom domain is still returning HTTP 500.
- The current live server logs now show the real custom-domain error:

```text
Error: No such module "assets/seroval".
imported from "assets/server-GrSvPGNI.js"
```

That means the backend itself is not the reason `https://us.merqato.digital/` is down. The server bundle is still externalizing a runtime dependency instead of packaging it into the deployment.

## Fix plan

### 1. Fix the custom-domain SSR bundle

Update `vite.config.ts` so the server bundle includes the missing TanStack runtime dependencies, not just the first ones we already saw.

I will keep the existing custom server entry and expand the no-external bundling list to include:

- `seroval`
- `seroval-plugins`
- `cookie-es`
- `@tanstack/history`
- all `@tanstack/*` packages
- existing entries like `h3-v2`, `rou3`, `srvx`, and `@supabase/supabase-js`

I will also put this under the Vite 7-compatible server bundling key so it actually applies to the worker build.

### 2. Restore server error normalization

`src/server.ts` currently catches thrown SSR boot errors, but it no longer normalizes swallowed 500 JSON responses. I will restore that check so future SSR failures log the actual underlying error instead of only showing the generic branded error page.

### 3. Leave the database and storage alone

No database migration is needed. The database row and storage bucket already exist and are receiving data. Changing tables or storage policies would be scope creep and could weaken security.

### 4. Validate after the code change

After implementation, I will verify:

- `https://us.merqato.digital/` returns a real page instead of the error page.
- Published server logs no longer show missing module errors.
- The app can read the current `site_content` row.
- Admin save/upload still targets the same backend data.

### 5. Vercel admin editing remains a separate deployment configuration issue

The Vercel screenshot is clear: that deployment is missing `SUPABASE_SERVICE_ROLE_KEY`. The code uses the server-side admin client for edit/add/delete/upload/delete media operations, so Vercel must have the backend environment variables added in Vercel settings.

I can fix the Lovable/custom-domain deployment in code. I cannot inject the secret into Vercel from here; that must be added in the Vercel project settings and redeployed.