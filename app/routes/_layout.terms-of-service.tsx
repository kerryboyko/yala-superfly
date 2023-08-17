import type { LinksFunction } from "@remix-run/node";

import aboutStyles from "~/styles/about.css";
export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export default function TermsOfServiceRoute() {
  return (
    <main className="terms-of-service">
      <div>
        The terms of service are not yet written up, but here's a short
        explaination of what it will cover when the lawyers get through with it:
      </div>
      <ul>
        <li>Don't be a jerk.</li>
        <li>
          You can say what you want, but what you say may have consequences.
        </li>
        <li>
          Don't do anything here that is generally illegal in the United States,
          where this site is hosted, or wherever you may live, that will get us
          into legal trouble. Sometimes laws are unjust, but just or unjust, we
          can't afford the legal fees.
        </li>
        <li>
          Don't do anything that could get us sued in civil court, such as
          libel.
        </li>
        <li>
          Generally speaking, you may not use this forum to promote the use of
          violence or try to undermine a democratic government, to suggest that
          people be deprived of life, liberty, or the pursuit of happiness based
          on race, religion, gender, or other criteria as seen fit.
          <ul>
            <li>
              We may interpret this <em>very</em> broadly, depending on how much
              of a jerk you're being.
            </li>
            <li>
              But generally speaking, if you're a member of one of the groups
              that the{" "}
              <a href="https://www.splcenter.org/hate-map">
                Southern Poverty Law Center has identified as a hate group
              </a>
              , you are not welcome here.
            </li>
          </ul>
        </li>
      </ul>
    </main>
  );
}
