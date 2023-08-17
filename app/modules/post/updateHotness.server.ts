import pick from "lodash/pick";

import { db } from "~/database";
import { getVotesByPostId } from "~/modules/post";

const HRS = 1000 * 60 * 60;
const HRS_48 = HRS * 48;

const getPeriod48 = (createdAt: Date): number =>
  (Date.now() - new Date(createdAt).getTime()) / HRS_48;

const getHotness = (votes: number, period48: number): number =>
  votes / Math.pow(2, period48);

const getUpcomingness = (votes: number, period48: number): number =>
  votes / Math.pow(2, period48 * period48);

const dueForAggregation = ({
  createdAt,
  lastAggregated,
}: {
  createdAt: Date;
  lastAggregated: Date;
}): boolean => {
  const hrsSinceLastUpdate =
    (Date.now() - new Date(lastAggregated).getTime()) / HRS;
  const period48 = getPeriod48(createdAt);
  return hrsSinceLastUpdate >= period48;
};

const getAccurateVoteCount = async (
  postIds: number[],
): Promise<{ id: number; aggregatedVotes: number }[]> => {
  const accurateVoteCount = await Promise.all(
    postIds.map((id) => getVotesByPostId(id)),
  );
  return postIds.map((id, idx) => ({
    id,
    aggregatedVotes: accurateVoteCount[idx]._sum.value || 0,
  }));
};

export const updateHotness = async () => {
  const allPosts = await db.post.findMany({
    select: { id: true, createdAt: true, lastAggregated: true },
  });
  const postsToUpdate = allPosts.filter(
    (post) =>
      post.lastAggregated === null ||
      dueForAggregation({
        createdAt: post.createdAt,
        lastAggregated: post.lastAggregated,
      }),
  );
  // this should be the *only* place we should be doing the accurate count.
  const accurateVoteCounts = await getAccurateVoteCount(
    postsToUpdate.map(({ id }) => id),
  );
  const now = new Date();
  const payloads = postsToUpdate.map((post, idx) => {
    const period48 = getPeriod48(post.createdAt);
    const aggregatedVotes = accurateVoteCounts[idx].aggregatedVotes;
    const aggregatedHotness = getHotness(aggregatedVotes, period48);
    const aggregatedUpcomingness = getUpcomingness(aggregatedVotes, period48);
    return {
      ...post,
      aggregatedVotes,
      aggregatedHotness,
      aggregatedUpcomingness,
      lastAggregated: now,
    };
  });
  const result = await db.$transaction(
    payloads.map((payload) =>
      db.post.update({
        where: { id: payload.id },
        data: {
          ...pick(payload, [
            "aggregatedVotes",
            "aggregatedHotness",
            "aggregatedUpcomingness",
            "lastAggregated",
          ]),
        },
      }),
    ),
  );
  return result;
};

export default updateHotness;
