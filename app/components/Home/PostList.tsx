import { PostSummaryData } from "~/types/posts";
import PostSummarySmall from "../Post/PostSummarySmall";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const PostList = ({
  title,
  posts,
  className = "",
}: {
  title: string;
  posts: PostSummaryData[];
  className?: string;
}) => {
  return (
    <div className={`post-list ${className}`}>
      <Card className="card latest latest-posts">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
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
