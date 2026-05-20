import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

let serverEntryPromise: Promise<{ default: { fetch: Function } }> | undefined;

async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m as { default?: { fetch: Function } }).default ?? (m as unknown as { fetch: Function }),
    ) as Promise<{ default: { fetch: Function } }>;
  }
  return serverEntryPromise;
}

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request);
      return response;
    } catch (error) {
      console.error(consumeLastCapturedError() ?? error);
      return brandedErrorResponse();
    }
  },
};
