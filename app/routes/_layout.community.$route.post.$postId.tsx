import { useEffect } from "react";

import type { ActionFunction, LoaderArgs } from "@remix-run/node";
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
import { z } from "zod";

import { CreateComment } from "~/components/Comment/CreateComment";
import ShowComment from "~/components/Comment/ShowComment";
import {
  PostDetails,
  styles as postDetailsStyles,
} from "~/components/Post/PostDetails";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import createCommentTree from "~/logic/createCommentTree";
import { formDataToObject } from "~/logic/formDataToObject";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import { getMyVoteOnThisPost, getVotesByPostId } from "~/modules/post";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postDetailsStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const authSession = await getAuthSession(request);
  const commData = await db.communityModerators.findFirst({
    where: {
      moderatorId: authSession?.userId,
      communityRoute: params.route,
    },
  });
  const userModeratesCommunity = Array.isArray(commData) && commData.length > 0;
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
      comments: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
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

  const votes = await getVotesByPostId(post.id);
  const myVote = authSession?.userId
    ? await getMyVoteOnThisPost(authSession?.userId, post.id)
    : null;

  const commentTree = createCommentTree(post?.comments);
  return json({
    post: {
      ...omit(post, ["comments"]),
      voteCount: votes._sum.value,
      userVoted: myVote?.value || null,
    },
    comments: commentTree,
    communityRoute: params.route,
    postId: params.postid,
    loggedInUser: authSession?.userId,
    userModeratesCommunity,
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
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });

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
      authorId: authSession.userId,
    });
    const reply = await db.comment.create({ data: payload });
    return redirect(`#comment-${reply.id}`);
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
      {data && data.post ? (
        <PostDetails
          {...data.post}
          postId={data.post.id || ""}
          userModeratesThisCommunity={data.userModeratesCommunity}
          authorIsThisUser={data.post.authorId === data.loggedInUser}
        />
      ) : null}
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
          <ShowComment
            key={comment.comment?.id}
            {...comment}
            loggedInUser={data.loggedInUser}
          />
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
