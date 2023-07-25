import { Link } from "@remix-run/react";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import { useMemo } from "react";

export interface CommentSummaryData {
  index?: number;
  id: number | string;
  postId: number | string;
  postTitle: string;
  communityName: string;
  communityRoute: string;
  text: string;
  createdAt: string;
}

const findOrigin = (): string => {
  try {
    return window.location.origin;
  } catch (_err) {
    return "";
  }
};

export const CommentSummary: React.FC<CommentSummaryData> = ({
  id,
  postId,
  postTitle,
  communityName,
  communityRoute,
  text,
  createdAt,
  index = 0,
}) => {
  const origin = findOrigin();

  const [communityPath, postPath, permalink] = useMemo(() => {
    const communityPath = `/community/${communityRoute}`;
    const postPath = `/post/${postId}`;
    const permalinkPath = communityPath + postPath + `#comment-${id}`;
    const permalink = origin + permalinkPath;
    return [communityPath, postPath, permalink];
  }, [communityRoute, postId, id, origin]);

  return (
    <div className={`comment-summary ${index % 2 === 0 ? "even" : "odd"}`}>
      <div className="comment-summary__link">
        <div className="comment-summary__link__post-title">
          Re: <Link to={postPath}>{postTitle}</Link>
        </div>
        <div className="comment-summary__link__community-name">
          On <Link to={communityPath}>/c/{communityName}</Link> , posted{" "}
          <Link to={permalink}>{createdAt}</Link>
        </div>
      </div>
      <div className="comment-summary__text">
        <MarkdownDisplay markdown={text} />
      </div>
      <div className="comment-summary__permalink">
        <Link to={permalink}>Permalink</Link>
      </div>
    </div>
  );
};

export default CommentSummary;
