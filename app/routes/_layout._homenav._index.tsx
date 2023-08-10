import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useOutletContext } from "react-router";
import { HomePage, styles as homePageStyles } from "~/components/Home/HomePage";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import { db } from "~/database";
import { useLoaderData } from "@remix-run/react";
import postSummaryStyles from "~/styles/post-summary.css";
import aboutStyles from "~/styles/about.css";
import voterStyles from "~/styles/post-votes.css";
export const links: LinksFunction = linkFunctionFactory(
  aboutStyles,
  postSummaryStyles,
  voterStyles,
  homePageStyles,
);

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};
export const loader: LoaderFunction = async ({ request }) => {
  const queryParams = grabQueryParams(request.url);
  const pagination = Object.assign({}, defaultPagination, queryParams);
  const skip = Math.max(0, (pagination.pageNum - 1) * pagination.perPage);
  const authUser = await getAuthSession(request);
  const defaultWhereClause = {};
  const subscriptions = await db.communitySubscribers.findMany({
    where: {
      subscriberId: authUser?.userId,
    },
    select: {
      communityRoute: true,
    },
  });
  // this is taking five seconds for ONE post.
  // maybe I need to do some sort of caching system.
  const posts = await db.post.findMany({
    where: authUser?.userId ? { OR: subscriptions } : defaultWhereClause,
    orderBy: [{ aggregatedHotness: "desc" }, { aggregatedVotes: "desc" }],
    skip,
    take: pagination.perPage,
    select: {
      _count: {
        select: {
          comments: true,
        },
      },
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      text: true,
      link: true,
      authorId: true,
      communityRoute: true,
      aggregatedVotes: true,
      community: {
        select: {
          name: true,
        },
      },
      postVotes: {
        where: {
          voterId: authUser?.userId,
        },
        select: {
          value: true,
        },
      },
      author: {
        select: {
          userId: true,
          username: true,
        },
      },
      reactions: {
        select: {
          reactionName: true,
        },
      },
      tags: {
        select: {
          tagName: true,
        },
      },
    },
  });
  return json({
    posts: posts.map((post) => ({
      ...post,
      voteCount: post.aggregatedVotes,
      userVoted: post.postVotes[0]?.value || 0,
    })),
  });
};

export default function IndexRoute() {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn: boolean }>();
  const data = useLoaderData();
  return (
    <div className="framing">
      <HomePage posts={data.posts} isLoggedIn={isLoggedIn} />
    </div>
  );
}
