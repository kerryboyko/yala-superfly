import type { MouseEventHandler } from "react";

import { FileEdit, MessageSquarePlus } from "lucide-react";

import { DeleteCommentButton } from "./DeleteCommentButton";
import { Button } from "../ui/button";

interface CommentToolsProps {
  userIsAuthor?: boolean;
  userIsModerator?: boolean;
  handleShowReply: MouseEventHandler<HTMLButtonElement>;
  commentId: number;
  toggleShowEdit: () => void;
  showReplyField: boolean;
}

const ReplyButton = ({
  handleShowReply,
  showReplyField,
}: Pick<CommentToolsProps, "handleShowReply" | "showReplyField">) => (
  <Button
    type="button"
    onClick={handleShowReply}
    className={`comment-tools__reply-button ${showReplyField ? "cancel" : ""}`}
  >
    <MessageSquarePlus size="1rem" />
    {showReplyField ? "Cancel" : "Reply"}
  </Button>
);

export const CommentTools = ({
  userIsAuthor,
  userIsModerator,
  handleShowReply,
  commentId,
  toggleShowEdit,
  showReplyField,
}: CommentToolsProps) => (
  <div className="comment-tools">
    {userIsAuthor ? (
      <Button
        type="button"
        onClick={toggleShowEdit}
        className="edit-comment-button"
      >
        <FileEdit className="edit-comment-button--icon" />
        Edit
      </Button>
    ) : null}
    {userIsAuthor || userIsModerator ? (
      <DeleteCommentButton commentId={commentId} />
    ) : null}
    <ReplyButton
      showReplyField={showReplyField}
      handleShowReply={handleShowReply}
    />
  </div>
);

export default CommentTools;
