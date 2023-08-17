import { PostSummaryData } from "~/types/posts";
import { HottestSubscribed } from "./HottestSubscribed";
import { HottestPosts } from "./HottestPosts";

export const HomePage = ({
  posts,
  isLoggedIn,
  numPosts,
  pagination,
}: {
  posts: PostSummaryData[];
  isLoggedIn: boolean;
  numPosts: number;
  pagination: { perPage: number; pageNum: number };
}) => {
  return isLoggedIn ? (
    <HottestSubscribed
      posts={posts}
      numPosts={numPosts}
      pagination={pagination}
    />
  ) : (
    <HottestPosts posts={posts} numPosts={numPosts} pagination={pagination} />
  );
};
