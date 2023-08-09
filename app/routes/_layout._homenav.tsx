import type { LoaderFunction, TypedResponse } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { GenericErrorBoundary } from "~/components/Error/GenericErrorBoundary";
import { Header } from "~/components/Header/Header";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";
import headerStyles from "~/styles/header.css";
import indexStyles from "~/styles/index.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(headerStyles, indexStyles);

export default function HomeNav() {
  return (
    <>
      <main className="main">
        Home Nav
        <div className="outlet-homenav">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export const ErrorBoundary = (props: any) => (
  <GenericErrorBoundary {...props} />
);
