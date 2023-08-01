import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";

import { db } from "~/database";
import { getAuthSession } from "~/modules/auth";

export const action: ActionFunction = async ({ request, params }) => {
  const authUser = await getAuthSession(request);
  const userId = authUser?.userId;
  const commentId = parseInt(params.commentId || "", 10);
  const formData = await request.formData();
  const value = parseInt(formData.get("value") as string, 10);

  if (!userId || isNaN(commentId) || isNaN(value)) {
    // it's a bad request, but we don't want to throw an error;
    return null;
  }

  const upsert = await db.commentVote.upsert({
    where: {
      commentId_voterId: {
        commentId,
        voterId: userId,
      },
    },
    update: {
      value,
    },
    create: {
      commentId,
      voterId: userId,
      value,
    },
  });
  return json({ ...upsert }, { status: 200 });
};
