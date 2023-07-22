import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { readFromMDFile } from "~/logic/readFromMDFile.server";
import MarkdownDisplay from "~/components/Markdown/MarkdownDisplay";

import aboutStyles from "~/styles/about.css";

export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader: LoaderFunction = async ({ request }) => {
  const markdown = await readFromMDFile("about.md");
  return { markdown };
};

export default function IndexRoute() {
  const { markdown } = useLoaderData();

  return (
    <>
      <main>
        <div className="about">
          <MarkdownDisplay className="about__text" markdown={markdown} />
        </div>
      </main>
    </>
  );
}
