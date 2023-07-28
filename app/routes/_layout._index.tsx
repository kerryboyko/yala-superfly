import type { LinksFunction } from "@remix-run/node";
import AboutPage from "~/static/markdown/about.md";
import RoadmapPage from "~/static/markdown/roadmap.md";
import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";

import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(aboutStyles);

export default function IndexRoute() {
  return (
    <FormatMarkdownFile>
      <RoadmapPage />
      <AboutPage />
    </FormatMarkdownFile>
  );
}
