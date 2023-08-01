import { format } from "date-fns";

import { Form, Link, useFetcher, useNavigation } from "@remix-run/react";
import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import type { RecursiveCommentTreeNode } from "~/types/comments";
import { Badge } from "~/components/ui/badge";
import { MessageSquarePlus } from "lucide-react";
import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useEffect, useState } from "react";
import CreateComment from "./CreateComment";
import Voter from "../Votes/Voter";
import { CommentEditField } from "./CommentEditField";
import CommentTools from "./CommentTools";
import { Button } from "../ui/button";

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
    voteCount,
    userVoted,
  },
  childComments = [],
  loggedInUser,
  userIsModerator,
}: RecursiveCommentTreeNode & {
  loggedInUser?: string;
  userIsModerator?: boolean;
}) => {
  let navigation = useNavigation();
  const fetcher = useFetcher();

  const [showReplyField, setShowReplyField] = useState<boolean>(false);
  const [showEditField, setShowEditField] = useState<boolean>(false);
  const [editFieldText, setEditFieldText] = useState<string>(text);

  const humanCreatedAt = format(new Date(createdAt), "d MMMM, u - h:mm a");
  const humanUpdatedAt = format(new Date(updatedAt), "d MMMM, u - h:mm a");
  const handleShowReply: MouseEventHandler<HTMLButtonElement> = () => {
    setShowReplyField(true);
  };

  const toggleShowEdit = () => setShowEditField((state) => !state);
  const handleEditFieldText: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setEditFieldText(event.target.value);
  };
  const userIsAuthor = loggedInUser === authorId;

  const handleSaveEdit: MouseEventHandler<HTMLButtonElement> = () => {
    if (userIsAuthor) {
      fetcher.submit(
        { commentText: editFieldText, commentId: id },
        { method: "post", action: "/api/v1/edit-comment" },
      );
      toggleShowEdit();
    }
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
      className={`show-comment ${parentId === null ? "top-level" : "child"} ${
        userIsAuthor ? "author-is-logged-in-user" : ""
      }`}
    >
      <div className="show-comment__header">
        Comment by <Link to={`/user/${username}`}>{username}</Link> -{" "}
        <Link to={`/community/${route}/post/${postId}/comment/${id}/`}>
          Created: {humanCreatedAt}{" "}
          {updatedAt !== createdAt ? "Updated: " + humanUpdatedAt : null}
        </Link>
      </div>

      {showEditField ? (
        <CommentEditField
          onChange={handleEditFieldText}
          handleSaveEdit={handleSaveEdit}
          value={editFieldText}
          toggleShowEdit={toggleShowEdit}
        />
      ) : (
        <div className="show-comment__display">
          <MarkdownDisplay markdown={text} />
        </div>
      )}
      <div className="show-comment__footer">
        <Voter
          isComment={true}
          isSmall={true}
          id={id}
          votes={voteCount}
          userVoted={userVoted}
        />
        {showReplyField ? (
          <Form method="POST">
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
                <Button className="show-comment__footer__reply-button">
                  <MessageSquarePlus size="1rem" />
                  Send Reply
                </Button>
              </button>
            </div>
          </Form>
        ) : (
          <CommentTools
            userIsAuthor={userIsAuthor}
            userIsModerator={userIsModerator}
            handleShowReply={handleShowReply}
            toggleShowEdit={toggleShowEdit}
            commentId={id}
          />
        )}
      </div>
      {childComments && Array.isArray(childComments) && childComments.length > 0
        ? childComments.map((chiCom) => (
            <ShowComment
              key={chiCom.comment.id}
              {...chiCom}
              loggedInUser={loggedInUser}
              userIsModerator={userIsModerator}
            />
          ))
        : null}
    </div>
  );
};

export default ShowComment;
