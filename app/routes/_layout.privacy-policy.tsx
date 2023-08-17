import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function PrivacyPolicyRoute() {
  return (
    <main className="privacy-policy">
      <div>
        The privacy policy is not yet written up, but here's a short
        explaination of what it will cover when the lawyers get through with it:
      </div>
      <ul>
        <li>
          We do not collect data about you, except your email address, which we
          use to confirm your account.
        </li>
        <li>
          We won't store information about you in cookies, except the minimum
          required for you to be able to log in and use the site (which is
          basically your userId)
        </li>
        <li>
          We will store information that you create and post on the site.
          <ul>
            <li>YOU own the copyright</li>
            <li>
              BUT you give us a lifetime licence for us to republish and reuse
              it.
            </li>
          </ul>
        </li>
        <li>
          We can ban you for pretty much any reason we want. You don't have a
          right to use the service, using the service is a privilege.
          <ul>
            <li>
              This is mostly to cover our butts, as we don't want some neo-nazi
              or something to take a banning to civil court.
            </li>
            <li>
              This is also because we're a very small site (so far) and can
              adjudicate these things on a case-by-case basis without having a
              huge, encompassing terms-of-service. We will eventually, just not
              right now.
            </li>
          </ul>
        </li>
      </ul>
    </main>
  );
}
