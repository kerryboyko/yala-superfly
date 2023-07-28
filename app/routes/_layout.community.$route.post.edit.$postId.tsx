import type {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { styles as postDetailsStyles } from "~/components/Post/PostDetails";
import { db } from "~/database/db.server";
import { getAuthSession, requireAuthSession } from "~/modules/auth";

import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

import EditPost from "~/components/Post/EditPost";
import { post } from "@supabase/storage-js/dist/module/lib/fetch";

export const links = linkFunctionFactory(postDetailsStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const { route, postid } = params;
  const authUser = await requireAuthSession(request);
  const post = await db.post.findUnique({
    where: {
      id: parseInt(params.postId as string, 10),
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      text: true,
      link: true,
      embeds: true,
      community: { select: { name: true, route: true } },
      authorId: true, // will use to match against uuid from token
      author: { select: { username: true } },
    },
  });
  if (post?.authorId !== authUser.userId) {
    throw redirect(`/community/${params.route}/post/${params.postId}`);
  }

  return json(post);
};

export const action: ActionFunction = async ({ request }) => {
  // const authSession = await requireAuthSession(request, {
  //   onFailRedirectTo: "/login",
  //   verify: true,
  // });
  return null;
};

export default function EditPostRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="edit-post-container">
      <EditPost
        postId={data.id}
        communityRoute={data.community.route}
        initialText={data.text || ""}
        postTitle={data.title}
        postLink={data.link}
      />
      <pre>{JSON.stringify(data, null, 2)}</pre>
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
  console.error(error);
  return <div className="error-container">Error!</div>;
}
