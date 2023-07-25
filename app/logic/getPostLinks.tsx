import type { PostSummaryData } from "~/types/posts";

export const getCommentLink = ({
  communityRoute,
  id,
}: Pick<PostSummaryData, "id" | "communityRoute">) =>
  `/community/${communityRoute}/post/${id}`;

export const getCommunityLink = ({
  communityRoute,
}: Pick<PostSummaryData, "communityRoute">) => `/community/${communityRoute}`;

export const getAuthorRoute = ({ author }: Pick<PostSummaryData, "author">) =>
  `/user/${author}`;
