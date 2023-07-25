import { format } from "date-fns";

import { Form, Link, useNavigation } from "@remix-run/react";
import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { Badge } from "~/components/ui/badge";
import { MessageSquarePlus } from "lucide-react";
import type { MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import { comment } from "postcss";

export const ShowComment = ({
  comment: {
    id,
    createdAt,
    updatedAt,
    author: { username },
    authorId,
    parentId,
    postId,
    community: { route },
    text,
  },
  childComments = [],
  loggedInUser,
}: RecursiveCommentTreeNode & { loggedInUser?: string }) => {
  let navigation = useNavigation();

  const [showReplyField, setShowReplyField] = useState<boolean>(false);

  const humanCreatedAt = format(new Date(createdAt), "d MMM, u - h:mm a");
  const humanUpdatedAt = format(new Date(updatedAt), "d MMM, u - h:mm a");
  const handleShowReply: MouseEventHandler<HTMLDivElement> = () => {
    setShowReplyField(true);
  };
  const authorIsLoggedInUser = loggedInUser === authorId;

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
      className={`show-comment ${parentId === null ? "top-level" : "child"} ${
        authorIsLoggedInUser ? "author-is-logged-in-user" : ""
      }`}
    >
      <div className="show-comment__header">
        Comment by <Link to={`/user/${username}`}>{username}</Link> -{" "}
        <Link to={`/community/${route}/post/${postId}/comment/${id}/`}>
          Created: {humanCreatedAt}{" "}
          {updatedAt !== createdAt ? "Updated: " + humanUpdatedAt : null}
        </Link>
      </div>
      <div className="show-comment__display">
        <MarkdownDisplay markdown={text} />
      </div>
      {authorIsLoggedInUser ? (
        <div className="debug debug__message">
          FIXME: The logged in user is the author of this post, and should have
          tools to edit or delete this post here.
        </div>
      ) : null}
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
          <Badge
            onClick={handleShowReply}
            className="show-comment__footer__reply-button"
          >
            <MessageSquarePlus size="1rem" />
            Reply
          </Badge>
        </div>
      )}
      {childComments && Array.isArray(childComments) && childComments.length > 0
        ? childComments.map((chiCom) => (
            <ShowComment
              key={chiCom.comment.id}
              {...chiCom}
              loggedInUser={loggedInUser}
            />
          ))
        : null}
    </div>
  );
};

export default ShowComment;
