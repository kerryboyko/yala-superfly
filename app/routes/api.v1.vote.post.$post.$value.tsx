import { json } from "@remix-run/node";
import { ActionFunction } from "@remix-run/server-runtime";
import { db } from "~/database";
import { getAuthSession } from "~/modules/auth";

const VALUES = {
  U: 1, // upvote
  N: 0, // neutral
  D: -1, // downvote
};

type valueKey = string & keyof typeof VALUES;

const valueIsValid = (
  value: string | undefined,
): value is string & keyof typeof VALUES => {
  return typeof value === "string" && Object.keys(VALUES).includes(value);
};

export const action: ActionFunction = async ({ request, params }) => {
  const authUser = await getAuthSession(request);
  const userId = authUser?.userId;
  const { post, value } = params;
  const parsedPost = parseInt(post || "", 10);
  if (!userId || !valueIsValid(value) || isNaN(parsedPost)) {
    throw json({ message: `Bad Request`, status: 400 }, { status: 400 });
  }
  const voteExists = await db.postVote.findFirst({
    postId: parsedPost,
    voterId: userId,
  });

  if (voteExists) {
    const update = await db.postVote.update({
      where: {
        id: voteExists.id,
      },
      data: {
        value: VALUES[value],
      },
    });
    return json({ update }, { status: 200 });
  }
  const newVote = await db.postVote.create({
    data: {
      postId: parsedPost,
      voterId: userId,
      value: VALUES[value],
    },
  });

  return json({ newVote }, { status: 201 });
};
