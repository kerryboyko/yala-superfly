import type { LinksFunction } from "@remix-run/node";
import { useOutletContext } from "react-router";
import { HomePage } from "~/components/Home/HomePage";
import { AlternateHomePage } from "~/components/Home/AlternateHomePage";

import aboutStyles from "~/styles/about.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(aboutStyles);

export default function IndexRoute() {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn: boolean }>();
  return (
    <div className="framing">
      {isLoggedIn ? <HomePage posts={[]} /> : <AlternateHomePage posts={[]} />}
    </div>
  );
}
