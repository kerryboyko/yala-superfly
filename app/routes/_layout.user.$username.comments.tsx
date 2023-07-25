import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";

import pick from "lodash/pick";
import { format } from "date-fns";

import { grabQueryParams } from "~/logic/grabQueryParams";
import type { Pagination } from "~/types/posts";
import type { CommentSummaryData } from "~/components/Comment/CommentSummary";
import CommentSummary from "~/components/Comment/CommentSummary";

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

  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      _count: { select: { comments: true } },
      id: true,
      username: true,
      comments: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          text: true,
          post: {
            select: {
              id: true,
              title: true,
              community: { select: { name: true, route: true } },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Response("Not found.", {
      status: 404,
    });
  }

  if (skip > user._count.comments) {
    throw new Response("Not Enough Comments.", {
      status: 406,
    });
  }
  const authUser = await requireAuthSession(request);
  let visitorIsLoggedIn = authUser !== null;
  let visitorIsThisUser = authUser?.extraParams?.userId === user.id;

  return json({
    user: {
      ...pick(user, ["username"]),
    },
    comments: user.comments.map(
      (comment): CommentSummaryData => ({
        ...pick(comment, ["id", "text"]),
        createdAt: format(new Date(comment.createdAt), "d MMM, u - h:mm a"),
        communityRoute: comment.post.community.route,
        postId: comment.post.id,
        communityName: comment.post.community.name,
        postTitle: comment.post.title,
      }),
    ),
    isThisUser: visitorIsLoggedIn && visitorIsThisUser,
  });
};

export default function UserComments() {
  const data = useLoaderData();

  return (
    <div className="user-comments">
      {data.comments.map((comment: CommentSummaryData, idx: number) => (
        <CommentSummary key={comment.id} index={idx} {...comment} />
      ))}
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
