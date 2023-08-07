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
  return (
    <>
      <FormatMarkdownFile>
        <ul>
          <li>
            <NavLink to="./#intro">Intro</NavLink>
          </li>
          <li>
            <NavLink to="./#about">About</NavLink>
          </li>
          <li>
            <NavLink to="./#roadmap">Roadmap</NavLink>
          </li>
        </ul>
        <section id="intro">
          <Card>
            <CardHeader>
              <CardTitle>Intro:</CardTitle>
            </CardHeader>
            <CardContent>
              <IntroPage />
            </CardContent>
          </Card>
        </section>
        <hr />
        <section id="about">
          <Card>
            <CardHeader>
              <CardTitle>About:</CardTitle>
            </CardHeader>
            <CardContent>
              <AboutPage />
            </CardContent>
          </Card>
        </section>
        <hr />
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
