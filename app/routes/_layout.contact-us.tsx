import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function PrivacyPolicyRoute() {
  return (
    <main className="privacy-policy">
      <div>contact us form go here</div>
    </main>
  );
}
