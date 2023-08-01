import type { LinksFunction } from "@remix-run/node";
import { NavLink } from "@remix-run/react";

import FormatMarkdownFile from "~/components/Markdown/FormatMarkdownFile";
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
            <NavLink to="./#roadmap">Roadmap</NavLink>
          </li>
          <li>
            <NavLink to="./#about">About</NavLink>
          </li>
        </ul>
        <section id="intro">
          <IntroPage />
        </section>
        <section id="roadmap">
          <RoadmapPage />
        </section>
        <section id="about">
          <AboutPage />
        </section>
      </FormatMarkdownFile>
    </>
  );
}
