import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/database/db.server";
import pick from "lodash/pick";
import { format } from "date-fns";
import { getAuthSession, requireAuthSession } from "~/modules/auth";

import { grabQueryParams } from "~/logic/grabQueryParams";
import type { Pagination, PostSummaryData } from "~/types/posts";

import PostSummary from "~/components/Post/PostSummary";
import { Paginator } from "~/components/Paginator/Paginator";

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};

export const loader = async ({ params, request }: LoaderArgs) => {
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
  const authUser = await getAuthSession(request);
  let isThisUser = authUser?.userId === profile.userId;

  return json({
    ...profile,
    numberPosts: profile._count.posts,
    posts: profile.posts.map(
      (post): PostSummaryData => ({
        ...pick(post, ["createdAt", "title", "embeds", "id", "text", "link"]),
        createdAt: format(new Date(post.createdAt), "do MMM, yyyy h:mm aaaa"),
        author: profile.username,
        communityRoute: post.community.route,
        communityName: post.community.name,
        commentCount: post._count.comments,
      }),
    ),
    isThisUser: isThisUser,
    pagination,
  });
};

export default function UserProfilePosts() {
  const data = useLoaderData();
  return (
    <div>
      {data.posts.map((post: PostSummaryData, idx: number) => (
        <PostSummary showCommunity={true} index={idx} key={post.id} {...post} />
      ))}
      <Paginator
        perPage={data.pagination.perPage}
        currentPage={data.pagination.pageNum}
        totalCount={data.numberPosts}
        onChange={console.log}
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