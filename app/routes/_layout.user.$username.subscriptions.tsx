import { useState } from "react";

import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import pick from "lodash/pick";

import Subscription, {
  styles as subscriptionStyles,
} from "~/components/Subscription/Subscription";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/custom/card";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(subscriptionStyles);

interface SubscriptionType {
  communityRoute: string;
  community: {
    name: string;
    route: string;
    description: string | null;
    _count: {
      posts: number;
      comments: number;
    };
  };
}

export const loader = async ({ params, request }: LoaderArgs) => {
  const profile = await db.profile.findUnique({
    where: { username: params.username },
    select: {
      userId: true,
      username: true,
      subscribes: {
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
    subscribes: profile.subscribes,
    isThisUser: visitorIsThisUser,
  });
};

export default function UserComments() {
  const data = useLoaderData();
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const toggleShowDescription = () =>
    setShowDescription((state: boolean) => !state);

  return (
    <div className="user-subscribes">
      <Card className="user-subscribes__card">
        <CardHeader>
          <Button onClick={toggleShowDescription}>
            {showDescription ? "Hide Descriptions" : "Show Descriptions"}
          </Button>
        </CardHeader>

        <CardContent className="user-subscribes__card__content">
          {data.subscribes.map((subscription: SubscriptionType) => (
            <Subscription
              key={subscription.communityRoute}
              communityRoute={subscription.community.route}
              communityName={subscription.community.name}
              communityDescription={subscription.community.description || ""}
              numPosts={subscription.community._count.posts}
              numComments={subscription.community._count.comments}
              isSubscribed={true}
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
