import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function TermsOfServiceRoute() {
  return (
    <main className="tos">
      <div>Terms of service go here</div>
    </main>
  );
}
