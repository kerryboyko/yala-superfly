import { FileEdit, MessageSquarePlus } from "lucide-react";
import { Button } from "../ui/button";
import { MouseEventHandler } from "react";
import { DeleteCommentButton } from "./DeleteCommentButton";

interface CommentToolsProps {
  userIsAuthor?: boolean;
  userIsModerator?: boolean;
  handleShowReply: MouseEventHandler<HTMLButtonElement>;
  commentId: number;
  toggleShowEdit: () => void;
}

const ReplyButton = ({
  handleShowReply,
}: Pick<CommentToolsProps, "handleShowReply">) => (
  <Button
    type="button"
    onClick={handleShowReply}
    className="comment-tools__reply-button"
  >
    <MessageSquarePlus size="1rem" />
    Reply
  </Button>
);

export const CommentTools = ({
  userIsAuthor,
  userIsModerator,
  handleShowReply,
  commentId,
  toggleShowEdit,
}: CommentToolsProps) => {
  return (
    <div className="comment-tools">
      {userIsAuthor ? (
        <Button type="button" onClick={toggleShowEdit}>
          <FileEdit className="edit-comment-button--icon" />
          Edit
        </Button>
      ) : null}
      {userIsAuthor || userIsModerator ? (
        <DeleteCommentButton commentId={commentId} />
      ) : null}
      <ReplyButton handleShowReply={handleShowReply} />
    </div>
  );
};

export default CommentTools;
