import type { PostSummaryData } from "~/types/posts";

import { HottestPosts } from "./HottestPosts";
import { HottestSubscribed } from "./HottestSubscribed";

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
}) =>
  isLoggedIn ? (
    <HottestSubscribed
      posts={posts}
      numPosts={numPosts}
      pagination={pagination}
    />
  ) : (
    <HottestPosts posts={posts} numPosts={numPosts} pagination={pagination} />
  );
