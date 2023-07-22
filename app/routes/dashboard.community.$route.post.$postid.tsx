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
  useNavigation,
  useParams,
  useRouteError,
} from "@remix-run/react";
import omit from "lodash/omit";
import { CreateComment } from "~/components/Comment/CreateComment";
import ShowComment from "~/components/Comment/ShowComment";
import { PostDetails } from "~/components/Post/PostDetails";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import createCommentTree from "~/logic/createCommentTree";
import { formDataToObject } from "~/logic/formDataToObject";
import postDetailsStyles from "~/styles/post-details.css";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { z } from "zod";
import { requireAuthSession } from "~/modules/auth";

import { useEffect } from "react";

export const links: LinksFunction = () =>
  [postDetailsStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ request, params }: LoaderArgs) => {
  // params.route is not used here.
  const post = await db.post.findUnique({
    where: {
      id: parseInt(params.postid as string, 10),
    },
    select: {
      createdAt: true,
      updatedAt: true,
      title: true,
      text: true,
      link: true,
      embeds: true,
      community: { select: { name: true, route: true } },
      author: { select: { username: true } },
      comments: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              username: true,
            },
          },
          parentId: true,
          postId: true,
          community: {
            select: {
              route: true,
            },
          },
          text: true,
        },
      },
    },
  });
  if (!post) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  const commentTree = createCommentTree(post?.comments);
  return json({
    post: omit(post, ["comments"]),
    comments: commentTree,
    communityRoute: params.route,
    postId: params.postid,
  });
};

const commentSchema = z.object({
  text: z.string(),
  parentId: z.number().nullable().optional(),
  postId: z.number(),
  communityRoute: z.string(),
  authorId: z.string(),
});

export const action: ActionFunction = async ({ request }) => {
  console.log("hitting");
  const authUser = await requireAuthSession(request);
  if (authUser === null) {
    return redirect("/");
  }
  // this is used to post comments;
  try {
    const formData = await request.formData().then(formDataToObject);
    const NULL_VALUES = ["", undefined, null, NaN];
    const payload = commentSchema.parse({
      text: formData["comment-text"],
      parentId: NULL_VALUES.includes(formData["comment-parentId"])
        ? null
        : parseInt(formData["comment-parentId"], 10),
      postId: NULL_VALUES.includes(formData["comment-postId"])
        ? null
        : parseInt(formData["comment-postId"], 10),
      communityRoute: formData["comment-community-route"],
      authorId: authUser.extraParams.userId,
    });
    console.log(payload);
    const reply = await db.comment.create({ data: payload });
    return payload.parentId === null ? redirect(`#comment-${reply.id}`) : null;
  } catch (err: any) {
    console.error(err);
    return json({ status: 500, message: err?.message });
  }
};

export default function PostRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  useEffect(() => {
    if (navigation.state === "idle" && window) {
      const strippedUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, document.title, strippedUrl);
    }
  }, [navigation]);
  return (
    <div className="post-details">
      {data && data.post ? <PostDetails {...data.post} /> : null}
      <Form className="create-comment" method="post">
        <CreateComment
          placeholder="Write your comment here..."
          route={data.communityRoute ?? ""}
          postId={data.postId ?? ""}
        />
        <div className="create-comment__footer">
          <Button
            className="create-comment__footer--submit-button"
            type="submit"
          >
            Submit New Comment
          </Button>
        </div>
      </Form>
      <div className="all-comments">
        {data.comments.map((comment: RecursiveCommentTreeNode) => (
          <ShowComment key={comment.comment?.id} {...comment} />
        ))}
      </div>
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
