import "./lib/error-capture";

import serverEntry from "@tanstack/react-start/server-entry";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

function brandedErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request) {
    try {
      const response = await (serverEntry as { fetch: (r: Request) => Promise<Response> | Response }).fetch(request);
      return response;
    } catch (error) {
      console.error(consumeLastCapturedError() ?? error);
      return brandedErrorResponse();
    }
  },
};
