import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { format } from "date-fns";
import pick from "lodash/pick";
import { useEffect } from "react";

import { Paginator } from "~/components/Paginator/Paginator";
import PostSummary, {
  styles as postSummaryStyles,
} from "~/components/Post/PostSummary";
import { db } from "~/database/db.server";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth";
import {
  getMyVotesByUserIdOnPosts,
  getVotesByPostId,
} from "~/modules/post/service.server";
import type { Pagination, PostSummaryData } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postSummaryStyles);

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const authUser = await getAuthSession(request);
  const queryParams = grabQueryParams(request.url);
  // if ?pageNum= or ?perPage= is defined, use this.
  const pagination = Object.assign({}, defaultPagination, queryParams);
  // we are going to use offset pagination instead of cursor based pagination for now.
  // cursor based pagination works great for infinite scrolling, and scales, but
  // we really do need this.  Maybe some sort of caching?
  const skip = Math.max(0, (pagination.pageNum - 1) * pagination.perPage);

  const profile = await db.profile.findUnique({
    where: { username: params.username },
    select: {
      _count: { select: { posts: true } },
      userId: true,
      username: true,
      posts: {
        skip,
        take: pagination.perPage,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          title: true,
          embeds: true,
          text: true,
          link: true,
          community: { select: { name: true, route: true } },
          aggregatedHotness: true,
          aggregatedUpcomingness: true,
          aggregatedVotes: true,
          lastAggregated: true,
          _count: { select: { comments: true } },

          reactions: {
            select: {
              reaction: {
                select: {
                  name: true,
                },
              },
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                },
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

  if (skip > profile._count.posts) {
    throw new Response("Not Enough Posts.", {
      status: 406,
    });
  }

  let isThisUser = authUser?.userId === profile.userId;
  // TODO: we want to start using aggregated votes
  const votes = await db.$transaction(
    profile.posts.map((post) => getVotesByPostId(post.id)),
  );

  const myVotes = authUser?.userId
    ? await getMyVotesByUserIdOnPosts(
        authUser?.userId,
        profile.posts.map((post) => post.id),
      )
    : [];

  return json({
    ...profile,
    numberPosts: profile._count.posts,
    posts: profile.posts.map(
      (post, idx): PostSummaryData => ({
        ...pick(post, [
          "createdAt",
          "title",
          "embeds",
          "id",
          "text",
          "link",
          "aggregatedHotness",
          "aggregatedUpcomingness",
          "aggregatedVotes",
          "lastAggregated",
        ]),
        createdAt: format(new Date(post.createdAt), "do MMM, yyyy h:mm aaaa"),
        author: profile.username,
        communityRoute: post.community.route,
        communityName: post.community.name,
        commentCount: post._count.comments,
        isAuthor: true,
        userVoted: myVotes[idx]?.value || null,
        voteCount: votes[idx]._sum.value,
      }),
    ),
    isThisUser: isThisUser,
    pagination,
  });
};

export default function UserProfilePosts() {
  const data = useLoaderData();
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <div>
      {data.posts.map((post: PostSummaryData, idx: number) => (
        <PostSummary
          userIsAuthor={post.isAuthor}
          showCommunity={true}
          index={idx}
          key={post.id}
          userVoted={post.userVoted}
          voteCount={post.voteCount}
          {...post}
        />
      ))}
      <Paginator
        perPage={data.pagination.perPage}
        currentPage={data.pagination.pageNum}
        totalCount={data.numberPosts}
      />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
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
