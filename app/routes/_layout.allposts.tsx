import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { format, formatRelative } from "date-fns";
import PostSummary, {
  styles as postSummaryStyles,
} from "~/components/Post/PostSummary";
import { db } from "~/database/db.server";
import type { Pagination, PostSummaryData } from "~/types/posts";
import allPostsStyles from "~/styles/all-posts.css";
import { getAuthSession } from "~/modules/auth/session.server";
import { grabQueryParams } from "~/logic/grabQueryParams";
import pick from "lodash/pick";
import Paginator from "~/components/Paginator/Paginator";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postSummaryStyles, allPostsStyles);

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

  const [postCount, posts] = await db.$transaction([
    db.post.count(),
    db.post.findMany({
      skip,
      take: pagination.perPage,
      select: {
        _count: {
          select: {
            comments: true,
          },
        },
        embeds: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        title: true,
        text: true,
        link: true,
        authorId: true,
        communityRoute: true,
        community: {
          select: {
            name: true,
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
    }),
  ]);

  return json({
    postCount,
    posts: posts.map((post) => ({
      ...pick(post, "id", [
        "title",
        "text",
        "link",
        "communityRoute",
        "embeds",
      ]),
      userIsAuthor: post.authorId === authUser?.userId,
      commentCount: post._count.comments,
      createdAt: format(new Date(post.createdAt), "d MMMM, u - h:mm a"),
      communityName: post.community.name,
      author: post.author.username,
    })),
    pagination: {
      perPage: pagination.perPage,
      currentPage: pagination.pageNum,
      totalCount: postCount,
    },
  });
};

export default function CommunityProfileRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="all-posts">
      <div className="all-posts__header">
        <div className="all-posts__header__heading">
          Development Page: All Posts
        </div>
        <div className="all-posts__header__count">
          There are currently {data.postCount} posts in Yala
        </div>
      </div>
      <Paginator {...data.pagination} />

      {data.posts.map((post: PostSummaryData, idx: number) => (
        <PostSummary
          showCommunity={true}
          index={idx}
          key={post.id}
          userIsAuthor={post.isAuthor}
          {...post}
        />
      ))}
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
