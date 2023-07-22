import { Link } from "@remix-run/react";
import type { PostSummaryData } from "~/types/posts";
import { getCommunityLink, getCommentLink } from "~/logic/getPostLinks";
import { Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";

export const PostSummarySmall: React.FC<
  PostSummaryData & { index: number; showCommunity?: boolean }
> = ({ index, showCommunity, ...post }) => {
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
          <Link to={getCommunityLink(post)}>
            /community/{post.communityName}
          </Link>
        </div>
        <div className="post-summary-small__comments-link">
          <Link to={getCommentLink(post)}>Comments: {post.commentCount}</Link>
        </div>
      </div>
    </div>
  );
};

export default PostSummarySmall;
