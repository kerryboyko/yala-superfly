import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/database/db.server";
import { format, formatDistance } from "date-fns";
import PostSummarySmall from "~/components/Post/PostSummarySmall";
import pick from "lodash/pick";
import type { PostSummaryData } from "~/types/posts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import CommentSummarySmall from "~/components/Comment/CommentSummarySmall";
import { requireAuthSession } from "~/modules/auth";

export const loader = async ({ params, request }: LoaderArgs) => {
  const user = await db.user.findUnique({
    where: { username: params.username },
    select: {
      _count: { select: { posts: true } },
      id: true,
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
      subscribes: {
        select: {
          community: {
            select: {
              name: true,
              route: true,
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

  const authUser = await requireAuthSession(request);
  let visitorIsLoggedIn = authUser !== null;
  let visitorIsThisUser = authUser?.extraParams?.userId === user.id;

  return json({
    user: {
      ...pick(user, ["username"]),
    },
    joinedWhen: formatDistance(new Date(user.createdAt), new Date(), {
      addSuffix: true,
    }),
    createdAt: format(new Date(user.createdAt), "d MMM, u - h:mm a"),

    numberPosts: user._count.posts,
    overview: {
      posts: user.posts.map(
        (post): PostSummaryData => ({
          ...pick(post, ["createdAt", "title", "embeds", "id", "text", "link"]),
          createdAt: format(new Date(post.createdAt), "do MMM, yyyy h:mm aaaa"),
          author: user.username,
          communityRoute: post.community.route,
          communityName: post.community.name,
          commentCount: post._count.comments,
        }),
      ),
      comments: user.comments.map((comment) => ({
        ...comment,
        createdAt: format(
          new Date(comment.createdAt),
          "do MMM, yyyy h:mm aaaa",
        ),
      })),
    },
    subscribes: visitorIsLoggedIn && visitorIsThisUser ? user.subscribes : null,
    isThisUser: visitorIsLoggedIn && visitorIsThisUser,
  });
};

export default function UserProfileOverview() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="intro-overview">
        <div className="intro-overview__header">
          {data.isThisUser ? (
            <span>Your Profile</span>
          ) : (
            <span>
              Profile of{" "}
              <Link
                className="nav-link"
                to={`/dashboard/user/${data.user.username}`}
              >
                {data.user.username}
              </Link>
            </span>
          )}
        </div>
        <div className="intro-overview__joined">Joined: {data.joinedWhen}</div>
        <div className="intro-overview__created">Created: {data.createdAt}</div>
      </div>
      <Card className="latest latest-posts">
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

      <Card className="latest latest-comments">
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
