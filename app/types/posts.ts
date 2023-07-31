export interface PostSummaryData {
  id: number;
  createdAt: string;
  title: string;
  author: string;
  communityRoute: string;
  communityName: string;
  link: string | null;
  embeds: string | null;
  commentCount: number;
  text: string | null;
  isAuthor?: boolean;
  userVoted?: number | null;
  voteCount?: number | null;
}

export interface PostVoteData {
  aggregate: number;
  userVote: string;
}

export interface Pagination {
  perPage: number;
  pageNum: 1;
}

export type VoteValue = string & ("U" | "N" | "D");
