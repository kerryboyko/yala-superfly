import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState } from "react";

import { ImagePlus, Loader2, PenSquare } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import useImageFields from "~/hooks/useImageFields";
import createPostStyles from "~/styles/createpost.css";

import { styles as postImageStyles } from "./PostImage";
import { PostImageField } from "./PostImageField";
import { PostPreview } from "./PostPreview";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";
import { Switch } from "../ui/custom/switch";
import { Label } from "../ui/label";

export const styles = [postImageStyles, createPostStyles];

export const EditPost = ({
  initialText,
  postTitle,
  postLink,
  meta,
  loadingState,
}: {
  initialText: string;
  postTitle: string;
  postLink?: string | null;
  communityRoute: string;
  postId: number;
  meta?: any;
  loadingState: "idle" | "submitting" | "loading";
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [postBody, setPostBody] = useState<string>(initialText);

  const handlePreviewSwitch: FormEventHandler<HTMLButtonElement> = (_event) =>
    setShowPreview((state) => !state);

  const handlePostChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setPostBody(event.target.value);
  };

  const { imageFields, addField, editField, removeField } = useImageFields(
    meta?.images || [],
  );

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
          name="text"
        />
      </CardContent>
      {imageFields && imageFields.length ? (
        <>
          <CardHeader className="editor__header__image-header">
            <CardTitle className="editor__header__title">Images:</CardTitle>
          </CardHeader>
          {imageFields.map((imgSrc: string, idx: number) => (
            <PostImageField
              key={`${imgSrc}-${idx}`}
              value={imgSrc}
              editField={editField(idx)}
              removeField={removeField(idx)}
            />
          ))}
        </>
      ) : null}

      <div className="editor__content__images__footer__editor">
        <Button
          type="button"
          className="editor__content__images__add-image"
          onClick={addField}
          disabled={imageFields.some((field) => field === "")}
        >
          <ImagePlus className="icon" />
          Add Image
        </Button>
      </div>
      <CardFooter className="editor__footer">
        <div className="editor__footer__show-preview">
          <Switch
            className="editor__footer__show-preview--switch"
            id="preview"
            checked={showPreview}
            onClick={handlePreviewSwitch}
          />
          <Label htmlFor="preview" className="editor__footer_switch__label">
            Show Preview
          </Label>
        </div>
        <Button
          className="editor__footer__button submit"
          type="submit"
          disabled={loadingState !== "idle"}
        >
          {loadingState === "idle" ? (
            <PenSquare className="icon" />
          ) : (
            <Loader2 className="icon loading" />
          )}
          Submit
        </Button>
      </CardFooter>
      {showPreview ? (
        <PostPreview
          postTitle={postTitle}
          postLink={postLink || ""}
          imageFields={imageFields}
          postBody={postBody}
        />
      ) : null}
    </Card>
  );
};

export default EditPost;
