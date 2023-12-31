import { Link } from "@remix-run/react";
import { Link as LinkIcon } from "lucide-react";

import { Card, CardDescription, CardTitle } from "~/components/ui/custom/card";
import {
  getAuthorRoute,
  getCommunityLink,
  getCommentLink,
} from "~/logic/getPostLinks";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";
import postSummaryStyles from "~/styles/post-summary.css";
import type { PostSummaryData } from "~/types/posts";

import PostTools, { styles as postToolsStyles } from "./PostTools";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import { CardHeader } from "../ui/card";
import Voter, { styles as Votertyles } from "../Votes/Voter";

export const styles = [Votertyles, postToolsStyles, postSummaryStyles];

export const PostSummary: React.FC<
  PostSummaryData & {
    index: number;
    showCommunity?: boolean;
    userModerates?: boolean;
    userIsAuthor?: boolean;
    userVoted?: null | number;
    voteCount?: null | number;
  }
> = ({ index, userModerates, userIsAuthor, voteCount, userVoted, ...post }) => {
  const firstEmbed = post.embeds?.split(";")[0];
  const truncatedText: string | null = post.text
    ? truncateWithoutWordBreak(post.text, 250)
    : null;
  return (
    <Card
      className={`post-summary ${index % 2 === 0 ? "even" : "odd"} ${
        firstEmbed ? "with-embed" : "no-embed"
      }`}
      key={post.id}
    >
      <CardHeader className="post-summary__header">
        <Voter
          votes={voteCount}
          userVoted={userVoted}
          id={post.id}
          isComment={false}
        />
        <CardTitle className="post-summary__title">
          <Link to={getCommentLink(post)}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="post-summary__community-link">
          Posted {post.createdAt} to{" "}
          <Link to={getCommunityLink(post)}>/c/{post.communityRoute}</Link>
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

      {truncatedText ? (
        <MarkdownDisplay
          className="post-summary__text"
          markdown={truncatedText}
        />
      ) : null}
      {truncatedText && truncatedText !== post.text ? (
        <div className="post-summary__footer">
          <Link to={getCommentLink(post)}>Read More...</Link>
        </div>
      ) : null}
    </Card>
  );
};

export default PostSummary;
