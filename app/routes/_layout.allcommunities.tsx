import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { format, formatRelative } from "date-fns";
import { db } from "~/database/db.server";
import type { Pagination, PostSummaryData } from "~/types/posts";
import postSummaryStyles from "~/styles/post-summary.css";
import allCommunitiesStyles from "~/styles/all-communities.css";
import { getAuthSession } from "~/modules/auth/session.server";
import { grabQueryParams } from "~/logic/grabQueryParams";
import pick from "lodash/pick";
import Paginator from "~/components/Paginator/Paginator";
import Subscription from "~/components/Subscription/Subscription";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export const links: LinksFunction = () =>
  [allCommunitiesStyles, postSummaryStyles].map((href) => ({
    rel: "stylesheet",
    href,
  }));

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};

export const loader = async ({ request, params }: LoaderArgs) => {
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
          <Button type="button" onClick={toggleDescription}>
            {showDescription ? "Hide" : "Show"} Descriptions
          </Button>
        </div>
      </div>
      <Paginator {...data.pagination} />
      <Card className="all-communities__community-list">
        {data.communities.map((comm, idx: number) => (
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
