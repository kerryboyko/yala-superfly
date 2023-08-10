import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(aboutStyles);

export default function IndexRoute() {
  return <>Test</>;
}
