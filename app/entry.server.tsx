import { PassThrough } from "stream";

import { Response } from "@remix-run/node";
import type { EntryContext, Headers } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider } from "react-i18next";

import { createI18nextServerInstance } from "./integrations/i18n";
import updateHotness from "./modules/post/updateHotness.server";

const ABORT_DELAY = 5000;

// this is basically a job that runs every 3 hours to recalculate the hotness of posts.
const RECALC_HOTNESS_DELAY = 1000 * 60 * 60 * 3;

const recalcHotness = () => {
  console.info("Recalculating Hotness");
  updateHotness();
  setTimeout(recalcHotness, RECALC_HOTNESS_DELAY);
};
recalcHotness();

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady";

  return new Promise(async (res, reject) => {
    let didError = false;

    // First, we create a new instance of i18next so every request will have a
    // completely unique instance and not share any state
    const instance = await createI18nextServerInstance(request, remixContext);

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>,
      {
        [callbackName]() {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          res(
            new Response(body, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            }),
          );
          pipe(body);
        },
        onShellError(err: unknown) {
          reject(err);
        },
        onError(error: unknown) {
          didError = true;
          console.error(error);
        },
      },
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
