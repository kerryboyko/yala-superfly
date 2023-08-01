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
  if (
    ![
      comment.authorId,
      ...comment.community.moderators.map((m) => m.moderatorId),
    ].includes(authUser.userId)
  ) {
    throw redirect("/");
  }
  const deletion = await db.comment.delete({
    where: commentWhere,
  });
  return json({ ...deletion });
};
