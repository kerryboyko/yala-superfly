import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { format, formatDistance } from "date-fns";

import { UserTabs, styles as userTabStyles } from "~/components/User/UserTabs";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";
import postSummaryStyles from "~/styles/post-summary.css";
import userStyles from "~/styles/user.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(
  postSummaryStyles,
  userStyles,
  userTabStyles,
);

export const loader = async ({ params, request }: LoaderArgs) => {
  const profile = await db.profile.findUnique({
    where: { username: params.username },
    select: {
      userId: true,
      createdAt: true,
      bannedUntil: true,
      memberships: true,
      username: true,
      _count: {
        select: {
          comments: true,
          posts: true,
          moderates: true,
          subscribes: true,
        },
      },
    },
  });

  if (!profile) {
    throw new Response("Not found.", {
      status: 404,
    });
  }

  const authUser = await getAuthSession(request);
  const isThisUser = authUser?.userId === profile.userId;
  return json({
    profile,
    isThisUser,
    username: profile.username,
    joinedWhen: formatDistance(new Date(profile.createdAt), new Date(), {
      addSuffix: true,
    }),
    createdAt: format(new Date(profile.createdAt), "d MMMM, u - h:mm a"),
  });
};

export default function UserProfileRoute() {
  const { profile, isThisUser, joinedWhen, createdAt } =
    useLoaderData<typeof loader>();

  return (
    <div>
      <UserTabs
        username={profile.username}
        profile={profile}
        isThisUser={isThisUser}
      />
      <div className="framing">
        <div className="profile">
          <div className="profile__header">
            <span>
              Profile of{" "}
              <Link className="nav-link" to={`/user/${profile.username}`}>
                {profile.username}
              </Link>
            </span>
          </div>
          <div className="profile__joined">Joined: {joinedWhen}</div>
          <div className="profile__created">{createdAt}</div>
        </div>
        <div className="outlet">
          <Outlet context={{ isThisUser, username: profile.username }} />
        </div>
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
        Error: {username} does not seem to be a user in our database.
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading the profile for "{username}". Sorry.
    </div>
  );
}
