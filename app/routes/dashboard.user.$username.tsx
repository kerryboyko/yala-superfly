import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { UserTabs } from "~/components/User/UserTabs";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";

import userStyles from "~/styles/user.css";
import postSummaryStyles from "~/styles/post-summary.css";

export const links: LinksFunction = () =>
  [userStyles, postSummaryStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
    },
  });
  if (!user) {
    throw new Response("Not found.", {
      status: 404,
    });
  }

  const authUser = await requireAuthSession(request);
  let visitorIsLoggedIn = authUser !== null;
  let visitorIsThisUser = authUser?.extraParams?.userId === user.id;
  return json({
    user: {
      ...user,
      isThisUser: visitorIsLoggedIn && visitorIsThisUser,
    },
  });
};

export default function UserProfileRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <UserTabs username={data.user.username} />
      <div className="outlet">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const { username } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        Error: ${username} does not seem to be a user in our database.
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading the profile for "{username}". Sorry.
    </div>
  );
}
