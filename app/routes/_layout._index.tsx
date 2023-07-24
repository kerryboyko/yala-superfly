import type { LinksFunction } from "@remix-run/node";
import AboutPage from "~/components/About/AboutPage";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function IndexRoute() {
  return <AboutPage />;
}
