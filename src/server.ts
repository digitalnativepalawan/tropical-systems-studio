import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type FetchHandler = { fetch: (request: Request) => Promise<Response> | Response };

let serverEntryPromise: Promise<FetchHandler> | undefined;

async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then((m) => {
      return ((m as { default?: FetchHandler }).default ?? m) as FetchHandler;
    });
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
