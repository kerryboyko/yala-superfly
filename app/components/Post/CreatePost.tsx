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
import { Input } from "~/components/ui/input";
import useImageFields from "~/hooks/useImageFields";
import createPostStyles from "~/styles/createpost.css";

import { styles as postImageStyles } from "./PostImage";
import { PostImageField } from "./PostImageField";
import { PostPreview } from "./PostPreview";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";
import { Switch } from "../ui/custom/switch";
import { Label } from "../ui/label";

export const styles = [postImageStyles, createPostStyles];

export const CreatePost = ({
  loadingState,
  warning,
}: {
  loadingState: "idle" | "submitting" | "loading";
  warning?: string;
}) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postLink, setPostLink] = useState<string>("");
  const [postBody, setPostBody] = useState<string>("");
  const { imageFields, addField, editField, removeField } = useImageFields();

  const handlePreviewSwitch: FormEventHandler<HTMLButtonElement> = (_event) =>
    setShowPreview((state) => !state);

  const handlePostTitle: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPostTitle(event?.target?.value);
  };

  const handlePostLink: ChangeEventHandler<HTMLInputElement> = (event) => {
    setPostLink(event?.target?.value);
  };

  const handlePostChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setPostBody(event.target.value);
  };

  return (
    <Card className="create-post">
      <CardHeader className="header__condensed-padding bottom">
        <CardTitle>Title *</CardTitle>
      </CardHeader>
      <CardContent className="content__condensed-padding bottom">
        <Input
          name="title"
          type="text"
          onChange={handlePostTitle}
          value={postTitle}
        />
      </CardContent>
      <CardHeader className="header__condensed-padding bottom top">
        <CardTitle>URL to Link (optional)</CardTitle>
      </CardHeader>
      <CardContent className="content__condensed-padding">
        <Input
          name="link"
          type="text"
          onChange={handlePostLink}
          value={postLink}
        />
      </CardContent>

      <CardHeader className="editor__header header__condensed-padding bottom top">
        <CardTitle className="editor__header__title">Text (optional)</CardTitle>
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
        <CardHeader className="editor__header header__condensed-padding bottom top">
          <CardTitle className="editor__header__images">Images</CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="editor__content__images">
        {imageFields && imageFields.length
          ? imageFields.map((imgFld, idx) => (
              <PostImageField
                key={`${imgFld}+${idx}`}
                value={imgFld}
                editField={editField(idx)}
                removeField={removeField(idx)}
              />
            ))
          : null}
        <div className="editor__content__images__footer">
          <Button
            type="button"
            className="button"
            onClick={addField}
            disabled={imageFields.some((field) => field === "")}
          >
            <ImagePlus className="icon" />
            Add Image
          </Button>
        </div>
      </CardContent>
      {warning ? <div className="create-post__warning">{warning}</div> : null}
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
          className="button"
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
          postLink={postLink}
          imageFields={imageFields}
          postBody={postBody}
        />
      ) : null}
    </Card>
  );
};

export default CreatePost;
