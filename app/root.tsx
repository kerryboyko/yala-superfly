import type {
  LinksFunction,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";

import { i18nextServer } from "~/integrations/i18n";
import stylesheet from "~/styles/index.css";

import tailwindStylesheetUrl from "./tailwind.css";
import { getBrowserEnv } from "./utils/env";

export const links: LinksFunction = () =>
  [tailwindStylesheetUrl, stylesheet]
    .filter((el) => !!el)
    .map((href) => ({ rel: "stylesheet", href }));

export const meta: V2_MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Yala - Yet Another Link Aggregator",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18nextServer.getLocale(request);
  return json({
    locale,
    env: getBrowserEnv(),
  });
};

export default function App() {
  const { env, locale } = useLoaderData<typeof loader>();
  const { i18n } = useTranslation();

  useChangeLanguage(locale);

  return (
    <html lang={locale} dir={i18n.dir()} className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
