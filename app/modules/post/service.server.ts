import type { PrismaPromise } from "@prisma/client";

import { db } from "~/database/db.server";

export const getVotesByPostId = (
  postId: number,
): PrismaPromise<{ _sum: { value: number | null } }> =>
  db.postVote.aggregate({
    where: {
      postId,
    },
    _sum: {
      value: true,
    },
  });

export const getMyVoteOnThisPost = (
  userId: string,
  postId: number,
): PrismaPromise<{ value: number } | null> =>
  db.postVote.findUnique({
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

export const getVotesForManyPosts = async (
  posts: Array<{ id: number }>,
): Promise<Array<{ _sum: { value: number | null } }>> =>
  await db.$transaction(posts.map(({ id }) => getVotesByPostId(id)));

export const getMyVotesByUserIdOnPosts = async (
  userId: string,
  postIds: number[],
): Promise<Array<{ value: number } | null>> =>
  await db.$transaction(
    postIds.map((postId) => getMyVoteOnThisPost(userId, postId)),
  );
