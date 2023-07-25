import type { LinksFunction } from "@remix-run/node";
import AboutPage from "~/static/markdown/about.md";
import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function AboutRoute() {
  return (
    <FormatMarkdownFile>
      <AboutPage />
    </FormatMarkdownFile>
  );
}
