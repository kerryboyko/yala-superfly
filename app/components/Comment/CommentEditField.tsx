import { ChangeEventHandler, MouseEventHandler, useEffect } from "react";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";
import { Button } from "../ui/button";
import { useFetcher } from "@remix-run/react";

export const CommentEditField = ({
  value,
  onChange,
  handleSaveEdit,
  toggleShowEdit,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  toggleShowEdit: () => void;
  handleSaveEdit: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div className="show-comment__edit">
      <div className="show-comment__edit__textarea">
        <MarkdownTextarea
          name="comment-text"
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="show-comment__edit__commands">
        <Button
          className="show-comment__edit__commands__button cancel"
          onClick={toggleShowEdit}
          type="button"
        >
          Cancel
        </Button>
        <Button
          className="show-comment__edit__commands__button save-changes"
          type="button"
          onClick={handleSaveEdit}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CommentEditField;
