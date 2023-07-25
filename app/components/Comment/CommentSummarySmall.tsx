import { Link } from "@remix-run/react";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";

export interface CommentSummary {
  id: number | string;
  postId: number | string;
  postTitle: string;
  communityName: string;
  communityRoute: string;
  text: string;
  index: number;
  createdAt: string;
}

export const CommentSummarySmall: React.FC<CommentSummary> = ({
  id,
  postId,
  postTitle,
  communityName,
  communityRoute,
  text,
  createdAt,
  index,
}) => {
  const truncatedText = truncateWithoutWordBreak(text || "", 200);
  return (
    <div
      className={`comment-summary-small ${index % 2 === 0 ? "even" : "odd"}`}
    >
      <div className="comment-summary-small__link">
        <Link to={`/community/${communityRoute}/post/${postId}#comment-${id}`}>
          Re: {postTitle} in {communityName} at {createdAt}
        </Link>
      </div>
      <div className="comment-summary-small__text">{truncatedText}</div>
    </div>
  );
};

export default CommentSummarySmall;
