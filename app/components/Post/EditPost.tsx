import type { ChangeEventHandler } from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DragDropFile } from "~/components/DragDropFile/DragDropFile";
import { Loader2 } from "lucide-react";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";

export const EditPost = ({
  postId,
  communityRoute,
  initialText,
  postTitle,
  postLink,
}: {
  postId: string | number;
  communityRoute: string;
  initialText: string;
  postTitle: string;
  postLink?: string | null;
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [postBody, setPostBody] = useState<string>(initialText);

  const togglePreview = () => setShowPreview((state) => !state);

  const handlePostChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setPostBody(event.target.value);
  };

  return (
    <Card className="edit-post">
      <CardHeader className="editor__header header__condensed-padding bottom top">
        <CardTitle className="editor__header__title">Edit Text:</CardTitle>
      </CardHeader>
      <CardContent className="editor__content">
        <MarkdownTextarea
          className="editor__content__editor"
          placeholder={"Type your post here"}
          onChange={handlePostChange}
          value={postBody}
          name="post-text"
        />
      </CardContent>
      <CardFooter className="editor__footer">
        <Button
          className="editor__footer__button-preview"
          type="button"
          onClick={togglePreview}
        >
          {showPreview ? "Hide" : "Show"} Preview
        </Button>
        <Button className="editor__footer__button-cancel" type="button">
          Cancel Edits
        </Button>
        <Button className="editor__footer__button-submit" type="submit">
          Submit Edits
        </Button>
      </CardFooter>
      {showPreview ? (
        <>
          <hr />
          <CardContent className="post-preview">
            {postTitle ? (
              <div className="post-preview__title">
                {postLink ? (
                  <a
                    className="post-preview__link"
                    href={postLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {postTitle}
                  </a>
                ) : (
                  postTitle
                )}
              </div>
            ) : null}
            {/* {postEmbed ? (
              <img alt="" className="post-preview__embed" src={postEmbed} />
            ) : null} */}
            <MarkdownDisplay markdown={postBody} />
          </CardContent>
          <hr />
        </>
      ) : null}
    </Card>
  );
};

export default EditPost;
