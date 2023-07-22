import { format } from "date-fns";

import { Form, Link, useNavigation } from "@remix-run/react";
import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { Badge } from "~/components/ui/badge";
import { MessageSquarePlus } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";

export const ShowComment = ({
  comment: {
    id,
    createdAt,
    updatedAt,
    author: { username },
    parentId,
    postId,
    community: { route },
    text,
  },
  childComments = [],
}: RecursiveCommentTreeNode) => {
  let navigation = useNavigation();

  const [showReplyField, setShowReplyField] = useState<boolean>(false);

  const humanCreatedAt = format(new Date(createdAt), "d MMM, u - h:mm a");
  const humanUpdatedAt = format(new Date(updatedAt), "d MMM, u - h:mm a");
  const handleShowReply: MouseEventHandler<HTMLButtonElement> = () => {
    setShowReplyField(true);
  };

  useEffect(
    function resetFormOnSuccess() {
      if (navigation.state === "idle") {
        setShowReplyField(false);
      }
    },
    [navigation.state],
  );

  return (
    <div
      id={`comment-${id}`}
      className={`show-comment ${parentId === null ? "top-level" : "child"}`}
    >
      <div className="show-comment__header">
        Comment by <Link to={`/dashboard/user/${username}`}>{username}</Link> -{" "}
        <Link
          to={`/dashboard/community/${route}/post/${postId}/comment/${id}/`}
        >
          Created: {humanCreatedAt}{" "}
          {updatedAt !== createdAt ? "Updated: " + humanUpdatedAt : null}
        </Link>
      </div>
      <div className="show-comment__display">
        <MarkdownDisplay markdown={text} />
      </div>
      {showReplyField ? (
        <Form method="POST">
          <div className="show-comment__footer">
            <div className="show-comment__footer__reply">
              <CreateComment
                placeholder="Write your reply..."
                postId={postId}
                parentId={id}
                route={route}
              />
              <button
                type="submit"
                className="show-comment__footer__reply--submit"
              >
                <Badge className="show-comment__footer__reply-button">
                  <MessageSquarePlus size="1rem" />
                  Send Reply
                </Badge>
              </button>
            </div>
          </div>
        </Form>
      ) : (
        <div className="show-comment__footer">
          <Badge className="show-comment__footer__reply-button">
            <MessageSquarePlus size="1rem" />
            <button
              type="button"
              className="show-comment__footer__reply-button--submit"
              onMouseDown={handleShowReply}
            >
              Reply
            </button>
          </Badge>
        </div>
      )}
      {childComments && Array.isArray(childComments) && childComments.length > 0
        ? childComments.map((chiCom) => (
            <ShowComment key={chiCom.comment.id} {...chiCom} />
          ))
        : null}
    </div>
  );
};

export default ShowComment;
