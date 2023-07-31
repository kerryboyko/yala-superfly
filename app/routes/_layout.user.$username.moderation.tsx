import { useState } from "react";

import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import pick from "lodash/pick";

import ModerationEntry, {
  styles as moderationEntryStyles,
} from "~/components/ModTools/ModerationEntry";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/custom/card";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(moderationEntryStyles);

export const loader = async ({ params, request }: LoaderArgs) => {
  const profile = await db.profile.findUnique({
    where: { username: params.username },
    select: {
      userId: true,
      username: true,
      moderates: {
        select: {
          communityRoute: true,
          community: {
            select: {
              name: true,
              route: true,
              description: true,
              _count: {
                select: { posts: true, comments: true },
              },
            },
          },
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
  const visitorIsThisUser = authUser?.userId === profile.userId;

  return json({
    profile: {
      ...pick(profile, ["username", "userId"]),
    },
    moderates: profile.moderates.map((m) => ({
      communityRoute: m.communityRoute,
      communityName: m.community.name,
      communityDescription: m.community.description,
      numPosts: m.community._count.posts,
      numComments: m.community._count.comments,
    })),
    isThisUser: visitorIsThisUser,
  });
};

export default function UserComments() {
  const data = useLoaderData();
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const toggleShowDescription = () =>
    setShowDescription((state: boolean) => !state);

  return (
    <div className="user-moderates">
      <Card className="user-moderates__card">
        <CardHeader>
          <Button onClick={toggleShowDescription}>
            {showDescription ? "Hide Descriptions" : "Show Descriptions"}
          </Button>
        </CardHeader>

        <CardContent className="user-moderates__card__content">
          {data.moderates.map((moderation: ModerationEntry) => (
            <ModerationEntry
              key={moderation.communityRoute}
              communityRoute={moderation.communityRoute}
              communityName={moderation.communityName}
              communityDescription={moderation.communityDescription || ""}
              numPosts={moderation.numPosts}
              numComments={moderation.numComments}
              showDescription={showDescription}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    console.error(error);
    return (
      <div className="error-container">
        We could not find the user in question.
      </div>
    );
  }
  if (isRouteErrorResponse(error) && error.status === 406) {
    return (
      <div className="error-container">
        That user does not have enough records to fill this page.
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading this page. Sorry.
    </div>
  );
}
