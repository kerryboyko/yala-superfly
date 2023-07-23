import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
import AboutPage from "~/static/markdown/about.md";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function IndexRoute() {
  return (
    <main className="about">
      <div className="about__text">
        <div className="markdown-display">
          <AboutPage />
        </div>
      </div>
    </main>
  );
}
