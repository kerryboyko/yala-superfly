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
import {
  ShowComment,
  styles as showCommentStyles,
} from "~/components/Comment/ShowComment";
import { checkIfUserBanned } from "~/components/ModTools/logic/checkIfUserBanned";
import {
  PostDetails,
  styles as postDetailsStyles,
} from "~/components/Post/PostDetails";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import createCommentTree from "~/logic/createCommentTree";
import { formDataToObject } from "~/logic/formDataToObject";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import {
  getMyVotesByUserIdOnComments,
  getVotesForManyComments,
} from "~/modules/comments";
import { getMyVoteOnThisPost, getVotesByPostId } from "~/modules/post";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import { Loader2, MessageSquarePlus } from "lucide-react";

export const links = linkFunctionFactory(postDetailsStyles, showCommentStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const authSession = await getAuthSession(request);

  const isUserBanned = authSession
    ? await checkIfUserBanned(authSession.userId, params.route || "")
    : false;

  const moderatorData = await db.communityModerators.findFirst({
    where: {
      moderatorId: authSession?.userId,
      communityRoute: params.route,
    },
    select: {
      id: true,
    },
  });
  const userIsModerator = !!moderatorData?.id;
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

  // count the votes before organizing the comment tree. It's just easier.
  const commentVotes = await getVotesForManyComments(post.comments);
  const myCommentVote = await getMyVotesByUserIdOnComments(
    authSession?.userId || "",
    post.comments.map((comment) => comment.id),
  );

  const commentTree = createCommentTree(
    post?.comments.map((comment, idx) => ({
      ...comment,
      voteCount: commentVotes[idx]._sum.value,
      userVoted: myCommentVote[idx]?.value || null,
    })),
  );
  return json({
    post: {
      ...omit(post, ["comments"]),
      voteCount: votes._sum.value,
      userVoted: myVote?.value || null,
    },
    comments: commentTree,
    communityRoute: params.route,
    postId: post.id,
    loggedInUser: authSession?.userId,
    userIsModerator,
    isUserBanned,
  });
};

const commentSchema = z.object({
  text: z.string().min(1, { message: `You can't post an empty comment` }),
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
    return json({ status: 500, ...err });
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
          userIsModerator={data.userIsModerator}
          authorIsThisUser={data.post.authorId === data.loggedInUser}
        />
      ) : null}
      {data.isUserBanned ? (
        <div>{data.isUserBanned}</div>
      ) : (
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
              disabled={navigation.state !== "idle"}
            >
              {navigation.state === "idle" ? (
                <MessageSquarePlus className="icon" />
              ) : (
                <Loader2 className="icon loading" />
              )}
              Submit New Comment
            </Button>
          </div>
        </Form>
      )}
      <div className="all-comments">
        {data.comments.map((comment: RecursiveCommentTreeNode) => (
          <ShowComment
            key={comment.comment?.id}
            {...comment}
            loggedInUser={data.loggedInUser}
            userIsModerator={data.userIsModerator}
            isUserBanned={data.isUserBanned}
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
