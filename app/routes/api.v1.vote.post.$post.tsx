import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";

import { db } from "~/database";
import { getAuthSession } from "~/modules/auth";

export const action: ActionFunction = async ({ request, params }) => {
  const authUser = await getAuthSession(request);
  const userId = authUser?.userId;
  const postId = parseInt(params.post || "", 10);
  const formData = await request.formData();
  const value = parseInt(formData.get("value") as string, 10);

  if (!userId || isNaN(postId) || isNaN(value)) {
    // it's a bad request, but we don't want to throw an error;
    return null;
  }
  const voteExists = await db.postVote.findUnique({
    where: {
      postId_voterId: {
        postId,
        voterId: userId,
      },
    },
    select: {
      value: true,
    },
  });

  if (voteExists) {
    if (voteExists.value === value) {
      return json({ message: `Value is already stored` }, { status: 204 });
    }
    const update = await db.postVote.update({
      where: {
        postId_voterId: {
          postId,
          voterId: userId,
        },
      },
      data: {
        value,
      },
    });
    return json({ update }, { status: 200 });
  }

  const newVote = await db.postVote.create({
    data: {
      postId,
      voterId: userId,
      value,
    },
  });

  return json({ newVote }, { status: 201 });
};
