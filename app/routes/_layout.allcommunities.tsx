import { useState } from "react";

import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import pick from "lodash/pick";

import { GenericErrorBoundary } from "~/components/Error/GenericErrorBoundary";
import Paginator from "~/components/Paginator/Paginator";
import Subscription from "~/components/Subscription/Subscription";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/custom/card";
import { db } from "~/database/db.server";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import allCommunitiesStyles from "~/styles/all-communities.css";
import subscribeButtonStyles from "~/styles/subscribe-button.css";
import subscriptionStyles from "~/styles/subscriptions.css";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(
  subscriptionStyles,
  allCommunitiesStyles,
  subscribeButtonStyles,
);

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};

export const loader = async ({ request }: LoaderArgs) => {
  const queryParams = grabQueryParams(request.url);
  // if ?pageNum= or ?perPage= is defined, use this.
  const pagination = Object.assign({}, defaultPagination, queryParams);
  // we are going to use offset pagination instead of cursor based pagination for now.
  // cursor based pagination works great for infinite scrolling, and scales, but
  // we really do need this.  Maybe some sort of caching?
  const skip = Math.max(0, (pagination.pageNum - 1) * pagination.perPage);
  const authUser = await getAuthSession(request);

  const [profile, communityCount, communities] = await db.$transaction([
    db.profile.findUnique({
      where: {
        userId: authUser?.userId,
      },
      select: {
        moderates: {
          select: {
            communityRoute: true,
          },
        },
        subscribes: {
          select: {
            communityRoute: true,
          },
        },
      },
    }),
    db.community.count(),
    db.community.findMany({
      skip,
      take: pagination.perPage,
      select: {
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
        route: true,
        createdAt: true,
        name: true,
        headerImage: true,
        description: true,
        isPublic: true,
      },
    }),
  ]);

  return json({
    communityCount,
    communities: communities.map((comm) => ({
      ...pick(comm, [
        "route",
        "name",
        "headerImage",
        "description",
        "isPublic",
      ]),
      postCount: comm._count.posts,
      commentCount: comm._count.comments,
      userModerates: profile?.moderates
        .map((m) => m.communityRoute)
        .includes(comm.route),
      userSubscribes: profile?.subscribes
        .map((m) => m.communityRoute)
        .includes(comm.route),
      createdAt: format(new Date(comm.createdAt), "d MMMM, u - h:mm a"),
    })),
    pagination: {
      perPage: pagination.perPage,
      currentPage: pagination.pageNum,
      totalCount: communityCount,
    },
  });
};

export default function CommunityProfileRoute() {
  const data = useLoaderData<typeof loader>();
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const toggleDescription = () => setShowDescription((state) => !state);
  return (
    <div className="all-communities">
      <div className="all-communities__header">
        <div className="all-communities__header__heading">
          Development Page: All Communities
        </div>
        <div className="all-communities__header__count">
          There are currently {data.pagination.totalCount} communities in Yala
        </div>
        <div>
          <Button
            className="button show-descriptions"
            type="button"
            onClick={toggleDescription}
          >
            {showDescription ? "Hide" : "Show"} Descriptions
          </Button>
        </div>
      </div>
      <Paginator {...data.pagination} />
      <Card className="all-communities__community-list">
        {data.communities.map((comm) => (
          <Subscription
            communityRoute={comm.route}
            communityName={comm.name}
            key={comm.route}
            communityDescription={comm.description}
            numPosts={comm.postCount}
            numComments={comm.commentCount}
            showDescription={showDescription}
            isSubscribed={comm.userSubscribes}
            isModerator={comm.userModerates}
          />
        ))}
      </Card>
    </div>
  );
}

export const ErrorBoundary = (props: any) => (
  <GenericErrorBoundary {...props} />
);
