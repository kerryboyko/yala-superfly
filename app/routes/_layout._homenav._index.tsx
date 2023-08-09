import type { LinksFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";

import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AboutPage from "~/static/markdown/about.md";
import IntroPage from "~/static/markdown/intro.md";
import RoadmapPage from "~/static/markdown/roadmap.md";
import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(aboutStyles);

export default function IndexRoute() {
  return <>Test</>;
}
