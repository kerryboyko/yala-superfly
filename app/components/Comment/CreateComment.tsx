import type { ChangeEventHandler } from "react";
import { useEffect, useState } from "react";

import { useActionData, useNavigation } from "@remix-run/react";

import MarkdownTextarea from "~/components/Markdown/MarkdownTextarea";

export interface CreateCommentProps {
  placeholder?: string;
  postId: string | number;
  parentId?: string | number | null;
  route: string;
}

export const CreateComment = ({
  placeholder = "Write your comment here...",
  postId,
  parentId = null,
  route,
}: CreateCommentProps) => {
  const [commentText, setCommentText] = useState<string>("");
  let navigation = useNavigation();
  const actionData = useActionData();

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    setCommentText(event.target.value);
  };

  useEffect(
    function resetFormOnSuccess() {
      if (navigation.state === "idle") {
        setCommentText("");
      }
    },
    [navigation.state],
  );

  return (
    <div className="create-comment">
      <div className="create-comment__edit">
        <MarkdownTextarea
          name="comment-text"
          placeholder={placeholder}
          header={parentId ? null : "Create New Comment"}
          className="create-comment__edit--input"
          value={commentText}
          onChange={handleTextareaChange}
        />
      </div>
      {actionData?.issues
        ? actionData.issues.map((issue: { message: string }) => (
            <div key={issue.message} className={`error-display warning`}>
              {issue.message}
            </div>
          ))
        : null}
      <input
        type="hidden"
        name="comment-parentId"
        value={parentId || undefined}
      />
      <input type="hidden" name="comment-postId" value={postId} />
      <input type="hidden" name="comment-community-route" value={route} />
    </div>
  );
};

export default CreateComment;
