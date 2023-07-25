import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { formatRelative } from "date-fns";
import PostSummary from "~/components/Post/PostSummary";
import { db } from "~/database/db.server";
import type { PostSummaryData } from "~/types/posts";
import postSummaryStyles from "~/styles/post-summary.css";

export const links: LinksFunction = () =>
  [postSummaryStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ params }: LoaderArgs) => {
  const communityPosts = await db.community.findUnique({
    where: { route: params.route },
    select: {
      route: true,
      name: true,
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
  }));
  return json({ posts });
};

export default function CommunityProfileRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return posts.map((post: PostSummaryData, idx: number) => (
    <PostSummary showCommunity={false} index={idx} key={post.id} {...post} />
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
