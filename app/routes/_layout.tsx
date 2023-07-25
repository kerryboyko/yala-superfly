import type {
  LinksFunction,
  LoaderFunction,
  TypedResponse,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { Header } from "~/components/Header/Header";

import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";

import headerStyles from "~/styles/header.css";
import indexStyles from "~/styles/index.css";

export const links: LinksFunction = () =>
  [indexStyles, headerStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader: LoaderFunction = async ({
  request,
}): Promise<
  TypedResponse<{
    isLoggedIn: boolean;
    user?: { username: string };
    message?: string;
  }>
> => {
  const authSession = await getAuthSession(request);
  if (!authSession) {
    return json({ isLoggedIn: false, username: undefined });
  }

  const { userId } = authSession;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new Error(`Unknown User`);
  }

  const profile = await db.profile.findUnique({
    where: { userId },
    select: { username: true, verified: true },
  });

  if (!profile) {
    return redirect("/complete-profile");
  }

  return json({ isLoggedIn: true, username: profile.username });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <main className="main">
        <Header isLoggedIn={data.isLoggedIn} username={data.username} />
        <div className="outlet-main">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const { username } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">Huh? Who the heck is "{username}"?</div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading the profile for "${username}". Sorry.
    </div>
  );
}
