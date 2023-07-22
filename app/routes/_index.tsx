import { type LinksFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import aboutStyles from "~/styles/about.css";
import AboutMarkdown from "~/static/markdown/about.md";

export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function AboutRoute() {
  return (
    <>
      <main>
        <div className="about">
          <div className="markdown-display content-box">
            <AboutMarkdown className="markdown-display" />
          </div>
        </div>
      </main>
    </>
  );
}
