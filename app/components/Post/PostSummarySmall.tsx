import { Link } from "@remix-run/react";
import { Link as LinkIcon, Image as ImageIcon } from "lucide-react";

import { getCommunityLink, getCommentLink } from "~/logic/getPostLinks";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";
import type { PostSummaryData } from "~/types/posts";

import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import Voter, { styles as Votertyles } from "../Votes/Voter";

export const styles = Votertyles;

export const PostSummarySmall: React.FC<
  PostSummaryData & { index: number; showCommunity?: boolean }
> = ({ index, ...post }) => {
  const truncatedText = truncateWithoutWordBreak(post.text || "", 100);
  return (
    <div className={`post-summary-small ${index % 2 === 0 ? "even" : "odd"}`}>
      <div className="post-summary-small__header">
        <div className="post-summary-small__header__icon-area">
          {post.embeds ? <ImageIcon className="icon" size="1rem" /> : null}
          {post.link ? <LinkIcon className="icon" size="1rem" /> : null}
        </div>
        <div className="post-summary-small__header__title">
          <a
            className="post-summary-small__header--link"
            href={post.link ? post.link : getCommentLink(post)}
          >
            {post.title}
          </a>
        </div>
      </div>
      {post.text ? (
        <MarkdownDisplay
          className="post-summary-small__text"
          markdown={truncatedText}
        />
      ) : null}
      <div className="post-summary-small__info">
        <div className="post-summary-small__community-link">
          Posted {post.createdAt} to{" "}
          <Link to={getCommunityLink(post)}>/c/{post.communityRoute}</Link>
        </div>
        <Voter
          votes={post.voteCount}
          userVoted={post.userVoted}
          id={post.id}
          isComment={false}
          isSmall={true}
        />
        <div className="post-summary-small__comments-link">
          <Link to={getCommentLink(post)}>
            Comments: {post.commentCount || "0"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostSummarySmall;
