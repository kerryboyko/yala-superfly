import { Link } from "@remix-run/react";
import type { PostSummaryData } from "~/types/posts";
import {
  getAuthorRoute,
  getCommunityLink,
  getCommentLink,
} from "~/logic/getPostLinks";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import PostTools, { styles as postToolsStyles } from "./PostTools";
import postSummaryStyles from "~/styles/post-summary.css";

export const styles = [postSummaryStyles].concat(postToolsStyles);

export const PostSummary: React.FC<
  PostSummaryData & {
    index: number;
    showCommunity?: boolean;
    userModerates?: boolean;
    userIsAuthor?: boolean;
  }
> = ({ index, showCommunity, userModerates, userIsAuthor, ...post }) => {
  const firstEmbed = post.embeds?.split(";")[0];
  return (
    <Card
      className={`post-summary ${index % 2 === 0 ? "even" : "odd"} ${
        firstEmbed ? "with-embed" : "no-embed"
      }`}
      key={post.id}
    >
      <CardTitle className="post-summary__title">
        <Link to={getCommentLink(post)}>{post.title}</Link>
      </CardTitle>
      <CardDescription>
        <div className="post-summary__community-link">
          Posted {post.createdAt} to{" "}
          <Link to={getCommunityLink(post)}>
            /community/{post.communityName}
          </Link>
        </div>
        {post.link ? (
          <div className="post-summary__link">
            <Link className="post-summary__link--literal" to={post.link}>
              <LinkIcon className="link-icon" size="1rem" />
              {post.link}
            </Link>
          </div>
        ) : null}
      </CardDescription>
      <div className="post-summary__info">
        <div className="post-summary__info__author-link">
          By: <Link to={getAuthorRoute(post)}>{post.author}</Link>
        </div>
        <div className="post-summary__info__tools">
          <PostTools
            isModerator={userModerates}
            isAuthor={userIsAuthor}
            communityRoute={post.communityRoute}
            postId={post.id}
            postTitle={post.title}
          />
          <Link to={getCommentLink(post)}>Comments: {post.commentCount}</Link>
        </div>
      </div>

      {firstEmbed ? (
        <div className="post-summary__embed">
          <Link to={post?.link || firstEmbed || getCommentLink(post)}>
            <img
              className="post-summary__embed__image"
              src={firstEmbed}
              alt={post.title}
            />
          </Link>
        </div>
      ) : null}
      {post.text ? <div className="post-summary__text">{post.text}</div> : null}
    </Card>
  );
};

export default PostSummary;
