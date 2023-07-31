import { useCallback } from "react";

import { useFetcher } from "@remix-run/react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

import postVoteStyles from "~/styles/post-votes.css";

export const styles = postVoteStyles;

const coerceVotes = (votes: number | null | undefined): number =>
  typeof votes !== "number" ? 0 : votes;

export const PostVotes = ({
  votes,
  userVoted,
  postId,
  isSmall,
}: {
  votes?: number | null;
  userVoted?: number | null;
  postId: number;
  isSmall?: boolean;
}) => {
  const voteFetcher = useFetcher();
  const postVotes = coerceVotes(votes);

  const handleVote = useCallback(
    (vote: number) => () => {
      voteFetcher.submit(
        { value: vote === userVoted ? 0 : vote },
        { method: "post", action: `/api/v1/vote/post/${postId}` },
      );
    },
    [postId, userVoted, voteFetcher],
  );

  return (
    <div className={`post-votes ${isSmall ? "small" : ""}`}>
      <button
        onClick={handleVote(1)}
        className={`post-votes__up ${userVoted === 1 ? "selected" : ""} ${
          isSmall ? "small" : ""
        }`}
      >
        <ArrowBigUp />
      </button>
      <div
        className={`post-votes__count ${postVotes < 0 ? "deficit" : ""} ${
          isSmall ? "small" : ""
        }`}
      >
        {postVotes}
      </div>
      <button
        onClick={handleVote(-1)}
        className={`post-votes__down ${userVoted === -1 ? "selected" : ""} ${
          isSmall ? "small" : ""
        }`}
      >
        <ArrowBigDown />
      </button>
    </div>
  );
};

export default PostVotes;
