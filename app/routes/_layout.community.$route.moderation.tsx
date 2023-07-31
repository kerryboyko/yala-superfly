import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";

import BanUsers from "~/components/ModTools/BanControl/BanUsers";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";
import communityStyles from "~/styles/community.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(communityStyles);

export const loader = async ({ params, request }: LoaderArgs) => {
  const authUser = await requireAuthSession(request, {
    verify: true,
    onFailRedirectTo: `/community/${params.route}`,
  });
  const userId = authUser?.userId;
  const isModerator = await db.communityModerators.findFirst({
    where: {
      communityRoute: params?.route,
      moderatorId: userId,
    },
    select: { id: true },
  });
  if (!isModerator) {
    return redirect(`/community/${params.route}`);
  }
  const community = await db.community.findUnique({
    where: { route: params.route },
    select: {
      createdAt: true,
      createdBy: {
        select: {
          username: true,
        },
      },
      headerImage: true,
      description: true,
      name: true,
      route: true,
      isPublic: true,
      communitySubscribers: {
        select: {
          subscriber: {
            select: {
              username: true,
            },
          },
        },
      },
      communityBans: {
        select: {
          bannedUser: {
            select: { username: true },
          },
          bannedBy: {
            select: { username: true },
          },
          banReason: true,
        },
      },
      moderators: {
        select: {
          moderator: {
            select: { username: true, userId: true },
          },
        },
      },
    },
  });
  if (!community) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  return json({
    community,
    userIsModerator: !!isModerator,
    route: params.route,
  });
};

export default function CommunityModerationRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="moderate-community">
      <BanUsers
        communityRoute={data.route || ""}
        bannedUsers={data.community.communityBans}
      />
    </div>
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
