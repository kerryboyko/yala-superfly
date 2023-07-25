import { Link, useFetcher } from "@remix-run/react";
import truncateWithoutWordBreak from "~/logic/truncateWithoutWordBreak";
import { MinusCircle } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SubscribeButton } from "./SubscribeButton";

export interface Subscription {
  communityRoute: string;
  communityName: string;
  communityDescription: string;
  numPosts: number;
  numComments: number;
  isSubscribed: boolean;
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
}) => {
  const fetcher = useFetcher();
  const truncatedDescription = truncateWithoutWordBreak(
    communityDescription || "",
    200,
  );
  const Icon = isSubscribed ? MinusCircle : PlusCircle;

  return (
    <div className={`subscription`}>
      <div className="subscription__name">
        <Link to={`/community/${communityRoute}`}>{communityName}</Link>
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
