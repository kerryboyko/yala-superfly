import { Link } from "@remix-run/react";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";

import { SubscribeButton } from "./SubscribeButton";

import subscriptionStyles from "~/styles/subscriptions.css";

export const styles = subscriptionStyles;

export interface Subscription {
  communityRoute: string;
  communityName: string;
  communityDescription: string | null;
  numPosts: number;
  numComments: number;
  isSubscribed?: boolean;
  isModerator?: boolean;
  showDescription: boolean;
}

export const Subscription: React.FC<Subscription> = ({
  communityRoute,
  communityName,
  communityDescription,
  numPosts,
  numComments,
  isSubscribed,
  showDescription,
  isModerator,
}) => {
  const truncatedDescription = truncateWithoutWordBreak(
    communityDescription || "",
    200,
  );

  return (
    <div className={`subscription`}>
      <div className="subscription__name">
        <Link to={`/community/${communityRoute}`}>{communityName}</Link>
        {isModerator ? (
          <>
            {" - "}
            <Link
              className="subscription__name__moderate-link"
              to={`/community/${communityRoute}/moderation`}
            >
              Moderate
            </Link>
          </>
        ) : null}
      </div>
      <div className="subscription__route">
        <Link to={`/community/${communityRoute}`}>/c/{communityRoute}</Link>
      </div>
      <div className="subscription__stats">
        Posts: {numPosts} | Comments: {numComments}
      </div>
      <div className="subscription__subscribe">
        <SubscribeButton
          communityRoute={communityRoute}
          isSubscribed={isSubscribed}
        />
      </div>
      {showDescription ? (
        <div className="subscription__description">{truncatedDescription}</div>
      ) : null}
    </div>
  );
};

export default Subscription;
