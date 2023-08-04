import type { ChangeEventHandler, MouseEventHandler } from "react";
import { useEffect, useState } from "react";

import { Form, Link, useFetcher, useNavigation } from "@remix-run/react";
import { format } from "date-fns";
import { Loader2, MessageSquarePlus } from "lucide-react";

import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import showCommentStyles from "~/styles/show-comment.css";
import type { RecursiveCommentTreeNode } from "~/types/comments";

import { CommentEditField } from "./CommentEditField";
import CommentTools from "./CommentTools";
import CreateComment from "./CreateComment";
import { Button } from "../ui/button";
import Voter from "../Votes/Voter";
import { MessagesSquare } from "lucide-react";

export const styles = showCommentStyles;

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
  isUserBanned,
}: RecursiveCommentTreeNode & {
  loggedInUser?: string;
  userIsModerator?: boolean;
  isUserBanned?: string | boolean | null;
}) => {
  let navigation = useNavigation();
  const fetcher = useFetcher();

  const [showReplyField, setShowReplyField] = useState<boolean>(false);
  const [showEditField, setShowEditField] = useState<boolean>(false);
  const [editFieldText, setEditFieldText] = useState<string>(text);

  const humanCreatedAt = format(new Date(createdAt), "d MMMM, u - h:mm a");
  const humanUpdatedAt = format(new Date(updatedAt), "d MMMM, u - h:mm a");
  const handleShowReply: MouseEventHandler<HTMLButtonElement> = () => {
    setShowReplyField((state) => !state);
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

      {showEditField && !isUserBanned ? (
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
      {showReplyField && !isUserBanned ? (
        <Form method="POST">
          {/* This post method hits the action of it's parent - i.e., /community/$route/post/$postId */}
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
              <Button
                type="submit"
                className="show-comment__footer__reply-button"
              >
                {navigation.state === "idle" ? (
                  <MessagesSquare className="icon" />
                ) : (
                  <Loader2 className="icon loading" />
                )}
                Send Reply
              </Button>
            </button>
          </div>
        </Form>
      ) : null}
      <div className="show-comment__footer">
        <Voter
          isComment={true}
          isSmall={true}
          id={id}
          votes={voteCount}
          userVoted={userVoted}
        />

        {!isUserBanned ? (
          <CommentTools
            userIsAuthor={userIsAuthor}
            userIsModerator={userIsModerator}
            handleShowReply={handleShowReply}
            showReplyField={showReplyField}
            toggleShowEdit={toggleShowEdit}
            commentId={id}
          />
        ) : null}
      </div>
      {childComments && Array.isArray(childComments) && childComments.length > 0
        ? childComments.map((chiCom) => (
            <ShowComment
              key={chiCom.comment.id}
              {...chiCom}
              loggedInUser={loggedInUser}
              userIsModerator={userIsModerator}
              isUserBanned={isUserBanned}
            />
          ))
        : null}
    </div>
  );
};

export default ShowComment;
