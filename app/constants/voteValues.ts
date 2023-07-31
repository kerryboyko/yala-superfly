import { VoteValue } from "~/types/posts";

export const VOTE_VALUES: Record<VoteValue, number> = {
  U: 1, // upvote
  N: 0, // neutral
  D: -1, // downvote
};
