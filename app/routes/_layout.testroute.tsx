import type { LinksFunction } from "@remix-run/node";
import AboutPage from "~/components/About/AboutPage";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function TestRoute() {
  return (
    <div>
      <div>This is the test route</div>
      <AboutPage />
    </div>
  );
}
