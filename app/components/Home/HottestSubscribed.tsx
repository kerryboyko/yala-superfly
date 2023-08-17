import { PostSummaryData } from "~/types/posts";
import { PostList } from "./PostList";

export const HottestSubscribed = ({ posts }: { posts: PostSummaryData[] }) => {
  return (
    <div className="home-page-like">
      <PostList
        title="Hottest posts from your subscribed communities:"
        posts={posts}
      />
    </div>
  );
};
