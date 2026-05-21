
## What's actually broken

These are two separate bugs, not one. The Supabase backend itself is healthy — data is saving fine when called from a working server.

### 1. Vercel deploy (`tropical-systems-studio.vercel.app`) — image #5

The "Upload failed: Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY" alert is thrown by `src/integrations/supabase/client.server.ts` when the server function runs on Vercel without those env vars set.

The Lovable-hosted worker has them automatically. Vercel does not — they have to be added in the Vercel project settings. The GitHub → Vercel pipeline never received them, so every server function that touches the admin client (load/save content, upload/delete media) returns 500 on Vercel.

This is a configuration step on Vercel's side, not a code bug. No code change fixes it.

### 2. Lovable-hosted URL (`merqato-grid-sync.lovable.app` / `us.merqato.digital`) — image #4

Worker logs show the real error:

```
Error: No such module "assets/@tanstack/router-core".
  imported from "assets/server-B51l60zQ.js"
```

(earlier the same crash was `No such module "h3-v2"`.)

Cause: `vite.config.ts` puts the externals fix in the wrong place. It currently sets:

```ts
vite: { resolve: { noExternal: [...] } }   // ← wrong key
```

The TanStack Start / Cloudflare worker bundle controls externals via `vite.ssr.noExternal`, not `vite.resolve.noExternal`. So nothing is being forced into the bundle — `h3-v2`, `@tanstack/router-core`, etc. are still externalized and the worker can't resolve them at runtime.

The branded "This page didn't load" page in image #4 is exactly what `src/server.ts` returns when the dynamic `import("@tanstack/react-start/server-entry")` fails because of that unresolved module.

## Fix plan

### Step A — Lovable site SSR (code change)

Edit `vite.config.ts` to put `noExternal` under `ssr`, and broaden the list so the router/start packages get bundled into the worker:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    ssr: {
      noExternal: [
        "h3-v2", "h3", "rou3", "srvx",
        /^@tanstack\//,         // router-core, start-server-core, etc.
        "@supabase/supabase-js",
      ],
    },
  },
});
```

That's the only change needed for the Lovable URL. After redeploy, `us.merqato.digital` will render the real site again and admin CRUD will save to Supabase as before.

### Step B — Vercel deploy (user action, no code change)

In the Vercel project for `tropical-systems-studio`:

1. Open **Settings → Environment Variables**
2. Add for **Production** (and Preview if you want previews to work):
   - `SUPABASE_URL` = `https://pvrdhxvtnnkpbvqsqmbh.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (copy from Lovable Cloud → Backend → API keys → service_role)
   - `SUPABASE_PUBLISHABLE_KEY` = the same value as `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL` = `https://pvrdhxvtnnkpbvqsqmbh.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (same publishable/anon key)
3. **Redeploy** the latest commit (env-var changes don't apply to existing builds).

`SUPABASE_SERVICE_ROLE_KEY` is the secret one — never commit it. Treat it like a password.

### Step C — verify

- Lovable URL: hard-refresh `us.merqato.digital`; site should load. Open admin, edit something, refresh — change persists.
- Vercel URL: after redeploy with env vars, repeat the same admin test.
- Both URLs read/write the same `site_content` row, so a change on one shows up on the other after reload.

## Why this won't loop again

The previous attempts kept editing `src/server.ts` and adding `noExternal` under the wrong Vite key, so the worker bundle never actually changed. The build kept externalizing router/h3, the dynamic import kept failing, and the wrapper kept returning the branded error page. Moving the option to `vite.ssr.noExternal` is the actual fix the worker logs were asking for.

## Out of scope

- No changes to AdminPanel, content.functions.ts, store/content.ts, or the database — those are already correct and the DB shows the latest update from 2026-05-21 00:45 UTC.
- Not touching `vercel.json` — it's fine; only the env vars are missing on Vercel.
