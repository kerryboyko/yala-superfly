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
}

export interface Pagination {
  perPage: number;
  pageNum: 1;
}
