import { useCallback } from "react";

import { useFetcher } from "@remix-run/react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

import Votertyles from "~/styles/post-votes.css";

export const styles = Votertyles;

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
  const Voter = coerceVotes(votes);

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
      <div
        className={`post-votes__count ${Voter < 0 ? "deficit" : ""} ${
          isSmall ? "small" : ""
        }`}
      >
        {Voter}
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

export default Voter;
