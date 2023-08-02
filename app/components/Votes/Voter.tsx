import { useCallback } from "react";

import { useFetcher } from "@remix-run/react";
import { ArrowBigUp, ArrowBigDown, Loader2 } from "lucide-react";

import postVotetyles from "~/styles/post-votes.css";

export const styles = postVotetyles;

const coerceVotes = (votes: number | null | undefined): number =>
  typeof votes !== "number" ? 0 : votes;

export const Voter = ({
  votes,
  userVoted,
  id,
  isSmall,
  isComment,
}: {
  votes?: number | null;
  userVoted?: number | null;
  id: number;
  isSmall?: boolean;
  isComment?: boolean;
}) => {
  const voteFetcher = useFetcher();
  const allVotes = coerceVotes(votes);

  const submitter = voteFetcher.submit;

  const handleVote = useCallback(
    (vote: number) => () => {
      submitter(
        { value: vote === userVoted ? 0 : vote },
        {
          method: "post",
          action: `/api/v1/vote/${isComment ? "comment" : "post"}/${id}`,
        },
      );
    },
    [id, userVoted, submitter, isComment],
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
      {voteFetcher.state === "idle" ? (
        <div
          className={`post-votes__count ${allVotes < 0 ? "deficit" : ""} ${
            isSmall ? "small" : ""
          }`}
        >
          {allVotes}
        </div>
      ) : (
        <div
          className={`post-votes__count ${
            isSmall ? "loading-spinner--xs small" : "loading-spinner--sm small"
          }`}
        />
      )}
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

export default Voter;
