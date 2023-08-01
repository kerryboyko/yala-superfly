import type { PrismaPromise } from "@prisma/client";

import { db } from "~/database/db.server";

export const getVotesByCommentId = (commentId: number) =>
  db.commentVote.aggregate({
    where: {
      commentId,
    },
    _sum: {
      value: true,
    },
  });

export const getMyVoteOnThisComment = (
  userId: string,
  commentId: number,
): PrismaPromise<{ value: number } | null> =>
  db.commentVote.findUnique({
    where: {
      commentId_voterId: {
        commentId,
        voterId: userId,
      },
    },
    select: {
      value: true,
    },
  });

export const getVotesForManyComments = async (
  comments: Array<{ id: number }>,
): Promise<Array<{ _sum: { value: number | null } }>> =>
  await db.$transaction(comments.map(({ id }) => getVotesByCommentId(id)));

export const getMyVotesByUserIdOnComments = async (
  userId: string,
  commentIds: number[],
): Promise<Array<{ value: number } | null>> =>
  await db.$transaction(
    commentIds.map((commentId) => getMyVoteOnThisComment(userId, commentId)),
  );
