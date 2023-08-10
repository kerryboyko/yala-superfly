import { PostSummaryData } from "~/types/posts";
import PostSummarySmall from "../Post/PostSummarySmall";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const HomePage = ({ posts }: { posts: PostSummaryData[] }) => {
  return (
    <div className="home-page">
      <Card className="card latest latest-posts">
        <CardHeader>
          <CardTitle>Latest posts from your subscribed communities:</CardTitle>
        </CardHeader>
        <CardContent>
          {posts.map((post, idx) => (
            <PostSummarySmall
              index={idx}
              showCommunity={true}
              {...post}
              key={post.id}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
