import { PostSummaryData } from "~/types/posts";
import { PostList } from "./PostList";
import Paginator from "../Paginator/Paginator";

export const HottestSubscribed = ({
  posts,
  numPosts,
  pagination,
}: {
  posts: PostSummaryData[];
  numPosts: number;
  pagination: { perPage: number; pageNum: number };
}) => {
  return (
    <div className="home-page-like">
      <PostList
        title="Hottest posts from your subscribed communities:"
        posts={posts}
      />
      <Paginator
        perPage={pagination.perPage}
        currentPage={pagination.pageNum}
        totalCount={numPosts}
      />
    </div>
  );
};
