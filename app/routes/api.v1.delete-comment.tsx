import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { db } from "~/database";
import { requireAuthSession } from "~/modules/auth";

export const action: ActionFunction = async ({ request }) => {
  const authUser = await requireAuthSession(request, {
    verify: true,
    onFailRedirectTo: "/login",
  });
  const formData = await request.formData();
  const commentId = formData.get("commentId") as string;

  const commentWhere = {
    id: parseInt(commentId, 10),
  };

  const comment = await db.comment.findFirstOrThrow({
    where: commentWhere,
    select: {
      _count: {
        select: {
          childComments: true,
        },
      },

      authorId: true,
      community: {
        select: {
          moderators: {
            select: {
              moderatorId: true,
            },
          },
        },
      },
    },
  });
  const userIsAuthor = comment.authorId === authUser.userId;
  const userIsModerator = comment.community.moderators
    .map((m) => m.moderatorId)
    .includes(authUser.userId);
  const commentHasChildren = comment._count.childComments > 0;

  // if the author is not a user or moderator, they cannot delete this post.
  if (!userIsAuthor && !userIsModerator) {
    throw redirect("/");
  }
  if (!commentHasChildren) {
    const deletion = await db.comment.delete({
      where: commentWhere,
    });
    return json(
      { message: "Comment has no children and has been deleted", ...deletion },
      { status: 200 },
    );
  }
  const softDeletion = await db.comment.update({
    where: commentWhere,
    data: {
      text: `[Deleted by ${userIsAuthor ? "author" : "moderator"}]`,
    },
  });
  return json(
    {
      ...softDeletion,
      message: "Comment has children. We've removed the text from this comment",
    },
    { status: 200 },
  );
};
