import type { PostSummaryData } from "~/types/posts";

export const getCommentLink = ({
  communityRoute,
  id,
}: Pick<PostSummaryData, "id" | "communityRoute">) =>
  `/dashboard/community/${communityRoute}/post/${id}`;

export const getCommunityLink = ({
  communityRoute,
}: Pick<PostSummaryData, "communityRoute">) =>
  `/dashboard/community/${communityRoute}`;

export const getAuthorRoute = ({ author }: Pick<PostSummaryData, "author">) =>
  `/dashboard/user/${author}`;
