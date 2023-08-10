import { LoaderFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { GenericErrorBoundary } from "~/components/Error/GenericErrorBoundary";
import { HomeTabs, styles as homeTabStyles } from "~/components/Home/HomeTabs";
import { getAuthSession } from "~/modules/auth";

import headerStyles from "~/styles/header.css";
import indexStyles from "~/styles/index.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(
  headerStyles,
  indexStyles,
  homeTabStyles,
);

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await getAuthSession(request);
  return json({
    isLoggedIn: !!isLoggedIn,
  });
};

export default function HomeNav() {
  const { isLoggedIn } = useLoaderData();
  return (
    <>
      <main className="main">
        <HomeTabs isLoggedIn={isLoggedIn} />
        <div className="outlet-home">
          <Outlet context={{ isLoggedIn }} />
        </div>
      </main>
    </>
  );
}

export const ErrorBoundary = (props: any) => (
  <GenericErrorBoundary {...props} />
);
