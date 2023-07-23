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
  console.log({ authSession });
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

  const profile = await db.profile.findUnique({
    where: { userId },
    select: { username: true, verified: true },
  });
  console.log({ user, profile });
  // if (user && profile === null) {
  //   return redirect("/create-profile");
  // }

  // if(!authUser){
  //   return json({isLoggedIn: false, username: undefined});
  // }
  // const {userId} = authUser;
  // const user = await db.user.findUniqueOrThrow({where: u})
  // const authUser = await requireAuthSession(request);

  // if (authUser === null) {
  //   return json({ isLoggedIn: false, message: "No Authentication" });
  // }
  // console.log({ authUser });
  // const { userId } = authUser;
  // const userRecord = await db.user.findUnique({ where: { id: userId } });
  // console.log({ userRecord });
  // const userProfile = await db.profile.findUnique({ where: { userId } });
  // console.log({ userProfile });
  // if (userRecord && !userProfile) {
  //   return redirect("/create-profile", { request });
  // }
  // const uuid = authUser?.extraParams?.userId;
  // const userRecord = await db.user.findUnique({
  //   where: {
  //     id: uuid,
  //   },
  // });
  // if (!userRecord) {
  //   logout(request);
  //   return json({
  //     isLoggedIn: false,
  //     message: "Authenticated but there's no record by that user",
  //   });
  // }
  // return json({ isLoggedIn: true, user: userRecord });
  return json({ isLoggedIn: true, username: profile.username });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <main>
        <Header isLoggedIn={data.isLoggedIn} username={data.username} />
        <Outlet />
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
