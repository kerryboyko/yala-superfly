import { PostSummaryData } from "~/types/posts";
import PostSummarySmall from "../Post/PostSummarySmall";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import homePageStyles from "~/styles/home-page.css";

export const styles = homePageStyles;

export const HomePage = ({
  posts,
  isLoggedIn,
}: {
  posts: PostSummaryData[];
  isLoggedIn: boolean;
}) => {
  return (
    <div className="home-page">
      <Card className="card latest latest-posts">
        <CardHeader>
          <CardTitle>
            {isLoggedIn
              ? `Hottest posts from your subscribed communities:`
              : "Hottest posts from our communities"}
          </CardTitle>
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
