import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { formatRelative } from "date-fns";
import PostSummary, {
  styles as postSummaryStyles,
} from "~/components/Post/PostSummary";
import { db } from "~/database/db.server";
import type { PostSummaryData } from "~/types/posts";
import { getAuthSession } from "~/modules/auth/session.server";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postSummaryStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const authUser = await getAuthSession(request);
  // it's okay if we don't find an authuser.

  const communityPosts = await db.community.findUnique({
    where: { route: params.route },
    select: {
      route: true,
      name: true,
      moderators: {
        where: {
          moderatorId: authUser?.userId,
        },
      },
      posts: {
        select: {
          _count: { select: { comments: true } },
          id: true,
          createdAt: true,
          title: true,
          link: true,
          text: true,
          embeds: true,
          author: {
            select: {
              username: true,
              userId: true,
            },
          },
        },
      },
    },
  });
  if (!communityPosts) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  const posts: PostSummaryData[] = communityPosts.posts.map((p) => ({
    ...p,
    createdAt: formatRelative(new Date(p.createdAt), new Date()),
    author: p.author.username,
    commentCount: p._count.comments,
    communityRoute: communityPosts.route,
    communityName: communityPosts.name,
    isAuthor: p.author.userId === authUser?.userId,
  }));
  return json({ posts, userModerates: communityPosts.moderators.length > 0 });
};

export default function CommunityProfileRoute() {
  const { posts, userModerates } = useLoaderData<typeof loader>();

  return posts.map((post: PostSummaryData, idx: number) => (
    <PostSummary
      userModerates={userModerates}
      showCommunity={false}
      index={idx}
      key={post.id}
      userIsAuthor={post.isAuthor}
      {...post}
    />
  ));
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
