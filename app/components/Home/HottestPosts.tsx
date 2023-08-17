import { PostSummaryData } from "~/types/posts";
import { PostList } from "./PostList";

export const HottestPosts = ({ posts }: { posts: PostSummaryData[] }) => {
  return (
    <div className="home-page-like">
      <PostList title="Hottest posts from our communities:" posts={posts} />
    </div>
  );
};
