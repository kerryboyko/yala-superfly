import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";

import { db } from "~/database";
import { getAuthSession } from "~/modules/auth";

export const action: ActionFunction = async ({ request, params }) => {
  const authUser = await getAuthSession(request);
  const userId = authUser?.userId;
  const postId = parseInt(params.postId || "", 10);
  const formData = await request.formData();
  const value = parseInt(formData.get("value") as string, 10);

  if (!userId || isNaN(postId) || isNaN(value)) {
    // it's a bad request, but we don't want to throw an error;
    return null;
  }
  const existingVote = await db.postVote.findUnique({
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
  if (existingVote && existingVote?.value === value) {
    return null;
  }
  const existingValue = existingVote?.value ?? 0;
  const incrementValue = value - existingValue;

  const upsert = await db.postVote.upsert({
    where: {
      postId_voterId: {
        postId,
        voterId: userId,
      },
    },
    update: {
      value,
    },
    create: {
      postId,
      voterId: userId,
      value,
    },
  });

  const updatePost = await db.post.update({
    where: {
      id: postId,
    },
    data: {
      aggregatedVotes: {
        increment: incrementValue,
      },
      aggregatedHotness: {
        increment: incrementValue,
      },
      aggregatedUpcomingness: {
        increment: incrementValue,
      },
    },
  });
  return json({ postVote: upsert, post: updatePost }, { status: 200 });
};
