import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { db } from "~/database/db.server";
import { formatRelative } from "date-fns";
import type { PostSummaryData } from "~/types/posts";
import PostSummary from "~/components/Post/PostSummary";
import postSummaryStyles from "~/styles/post-summary.css";

export const links: LinksFunction = () =>
  [postSummaryStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ params }: LoaderArgs) => {
  // params.route is not used here.
  const postRecords = await db.post.findMany({
    select: {
      id: true,
      createdAt: true,
      title: true,
      author: { select: { username: true } },
      community: { select: { name: true, route: true } },
      link: true,
      text: true,
      embeds: true,
      _count: { select: { comments: true } },
    },
  });
  if (!postRecords) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  const posts: PostSummaryData[] = postRecords.map((p) => ({
    id: p.id,
    text: p.text ?? "",
    createdAt: formatRelative(new Date(p.createdAt), new Date()),
    title: p.title,
    author: p.author.username,
    communityRoute: p.community.route,
    communityName: p.community.name,
    link: p.link,
    embeds: p.embeds,
    commentCount: p._count.comments,
  }));
  return json({ posts });
};

export default function PostRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.posts.map((post, idx) => (
        <PostSummary showCommunity={true} index={idx} key={post.id} {...post} />
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
