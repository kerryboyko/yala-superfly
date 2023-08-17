import { PostSummaryData } from "~/types/posts";
import { HottestSubscribed } from "./HottestSubscribed";
import { HottestPosts } from "./HottestPosts";

export const HomePage = ({
  posts,
  isLoggedIn,
}: {
  posts: PostSummaryData[];
  isLoggedIn: boolean;
}) => {
  return isLoggedIn ? (
    <HottestSubscribed posts={posts} />
  ) : (
    <HottestPosts posts={posts} />
  );
};
