import { Link } from "@remix-run/react";

import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";
import moderationStyles from "~/styles/subscriptions.css"; // this is correct - both use the same CSS.

export const styles = moderationStyles;
export interface ModerationEntry {
  communityRoute: string;
  communityName: string;
  communityDescription: string;
  numPosts: number;
  numComments: number;
}

export const ModerationEntry: React.FC<
  ModerationEntry & { showDescription: boolean }
> = ({
  communityRoute,
  communityName,
  communityDescription,
  numPosts,
  numComments,
  showDescription,
}) => {
  const truncatedDescription = truncateWithoutWordBreak(
    communityDescription || "",
    200,
  );

  return (
    <div className={`moderation`}>
      <div className="moderation__name">
        <Link to={`/community/${communityRoute}/moderation`}>
          {communityName}
        </Link>
      </div>
      <div className="moderation__route">
        <Link to={`/community/${communityRoute}/moderation`}>
          /c/{communityRoute}
        </Link>
      </div>
      <div className="moderation__stats">
        Posts: {numPosts} | Comments: {numComments}
      </div>
      {showDescription ? (
        <div className="moderation__description">{truncatedDescription}</div>
      ) : null}
    </div>
  );
};

export default ModerationEntry;
