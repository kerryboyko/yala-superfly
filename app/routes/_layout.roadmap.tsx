import type { LinksFunction } from "@remix-run/node";

import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import RoadmapPage from "~/static/markdown/roadmap.md";
import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(aboutStyles);

export default function RoadmapRoute() {
  return (
    <>
      <FormatMarkdownFile>
        <section id="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap:</CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapPage />
            </CardContent>
          </Card>
        </section>
      </FormatMarkdownFile>
    </>
  );
}
