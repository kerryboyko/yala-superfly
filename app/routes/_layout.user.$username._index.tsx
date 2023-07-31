import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { format, formatDistance } from "date-fns";
import pick from "lodash/pick";

import CommentSummarySmall from "~/components/Comment/CommentSummarySmall";
import PostSummarySmall, {
  styles as postSummaryStyles,
} from "~/components/Post/PostSummarySmall";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth/session.server";
import {
  getMyVotesByUserIdOnPosts,
  getVotesForManyPosts,
} from "~/modules/post";
import type { PostSummaryData } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postSummaryStyles);

export const loader = async ({ params, request }: LoaderArgs) => {
  const authUser = await getAuthSession(request);
  const profile = await db.profile.findUnique({
    where: { username: params.username },
    select: {
      _count: { select: { posts: true } },
      userId: true,
      username: true,
      createdAt: true,
      posts: {
        take: -10, // the last 10 posts added to the db.
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
        },
      },
      comments: {
        take: -10, // the last 10 comments added to the db.
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

  if (!profile) {
    throw new Response("Not found.", {
      status: 404,
    });
  }

  const votes = await getVotesForManyPosts(profile.posts);
  const userVotes = await getMyVotesByUserIdOnPosts(
    authUser?.userId || "",
    profile.posts.map(({ id }) => id),
  );

  return json({
    profile: {
      ...pick(profile, ["username"]),
    },
    joinedWhen: formatDistance(new Date(profile.createdAt), new Date(), {
      addSuffix: true,
    }),
    createdAt: format(new Date(profile.createdAt), "d MMMM, u - h:mm a"),

    numberPosts: profile._count.posts,
    overview: {
      posts: profile.posts.map(
        (post, idx): PostSummaryData => ({
          ...pick(post, ["title", "embeds", "id", "text", "link"]),
          createdAt: format(
            new Date(post.createdAt),
            "do MMMM, yyyy h:mm aaaa",
          ),
          author: profile.username,
          communityRoute: post.community.route,
          communityName: post.community.name,
          commentCount: post._count.comments,
          voteCount: votes[idx]._sum.value || null,
          userVoted: userVotes[idx]?.value || null,
        }),
      ),
      comments: profile.comments.map((comment) => ({
        ...comment,
        createdAt: format(
          new Date(comment.createdAt),
          "do MMM, yyyy h:mm aaaa",
        ),
      })),
    },
  });
};

export default function UserProfileOverview() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="card-area">
      <Card className="card latest latest-posts">
        <CardHeader>
          <CardTitle>Latest Posts:</CardTitle>
        </CardHeader>
        <CardContent>
          {data.overview.posts.map((post, idx) => (
            <PostSummarySmall
              index={idx}
              showCommunity={true}
              {...post}
              key={post.id}
            />
          ))}
        </CardContent>
      </Card>

      <Card className="card latest latest-comments">
        <CardHeader>
          <CardTitle>Latest Comments:</CardTitle>
        </CardHeader>
        <CardContent>
          {data.overview.comments.map((comment, idx) => (
            <CommentSummarySmall
              key={`${comment.id}-${comment.post.id}-${comment.post.community.route}`}
              index={idx}
              id={comment.id}
              postId={comment.post.id}
              postTitle={comment.post.title}
              communityName={comment.post.community.name}
              communityRoute={comment.post.community.route}
              text={comment.text}
              createdAt={comment.createdAt}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ErrorBoundary() {
  const { username } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        Error: ${username} does not seem to be a user in our database.
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading the profile for "{username}". Sorry.
    </div>
  );
}
