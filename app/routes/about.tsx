import type { LinksFunction } from "@remix-run/node";
import AboutPage from "~/static/markdown/about.md";
import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";

import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(aboutStyles);

export default function AboutRoute() {
  return (
    <FormatMarkdownFile>
      <AboutPage />
    </FormatMarkdownFile>
  );
}
