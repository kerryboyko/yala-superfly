import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import postVoteStyles from "~/styles/post-votes.css";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";

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

  const handleVote = (vote: number) =>
    useCallback(() => {
      voteFetcher.submit(
        { value: vote === userVoted ? 0 : vote },
        { method: "post", action: `/api/v1/vote/post/${postId}` },
      );
    }, [postId, userVoted]);

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
