import type { LoaderArgs } from "@remix-run/node";
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
import { getAuthSession } from "~/modules/auth/session.server";
import { getVotesByPostId } from "~/modules/post";
import type { PostSummaryData } from "~/types/posts";
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
          postVotes: {
            where: {
              voterId: authUser?.userId,
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
  const votes = await db.$transaction(
    communityPosts.posts.map((post) => getVotesByPostId(post.id)),
  );

  const posts: PostSummaryData[] = communityPosts.posts.map((post, idx) => ({
    ...post,
    createdAt: formatRelative(new Date(post.createdAt), new Date()),
    author: post.author.username,
    commentCount: post._count.comments,
    communityRoute: communityPosts.route,
    communityName: communityPosts.name,
    isAuthor: post.author.userId === authUser?.userId,
    userVoted: post.postVotes[0]?.value || null,
    voteCount: votes[idx]._sum.value,
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
