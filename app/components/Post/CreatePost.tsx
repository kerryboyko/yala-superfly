import type { ChangeEventHandler, FormEventHandler } from "react";
import { useReducer, useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { Input } from "~/components/ui/input";

import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";
import { Loader2, PenSquare, Eye, EyeOff } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/custom/switch";
import { PostImageField } from "./PostImageField";

const imageFieldReducer = (
  state: Array<string> = [],
  action: { type: string; image?: string; idx?: number },
) => {
  if (action.type === "new-field") {
    return state.concat("");
  }
  if (
    action.type === "edit-field" &&
    action.image &&
    action.idx !== undefined
  ) {
    return state
      .slice(0, action.idx)
      .concat(action.image)
      .concat(state.slice(action.idx + 1));
  }
  if (action.type === "delete-field" && action.idx !== undefined) {
    return state.slice(0, action.idx).concat(state.slice(action.idx + 1));
  }

  return state;
};

const useImageFields = () => {
  const [imageFields, dispatch] = useReducer(imageFieldReducer, []);
  const addField = () => dispatch({ type: "new-field" });
  const editField = (idx: number) => (value: string) =>
    dispatch({ type: "edit-field", image: value, idx });
  const removeField = (idx: number) => () =>
    dispatch({ type: "delete-field", idx });
  return { imageFields, addField, editField, removeField };
};

export const CreatePost = ({
  loadingState,
}: {
  loadingState: "idle" | "submitting" | "loading";
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
      <CardHeader className="editor__header header__condensed-padding bottom top">
        <CardTitle className="editor__header__images">Images</CardTitle>
      </CardHeader>
      <CardContent className="editor__content__images">
        {<pre>{JSON.stringify(imageFields, null, 2)}</pre>}
        {imageFields && imageFields.length
          ? imageFields.map((imgFld, idx) => (
              <PostImageField
                value={imgFld}
                editField={editField(idx)}
                removeField={removeField(idx)}
              />
            ))
          : null}
        <Button
          type="button"
          className="editor__content__images__add-image"
          onClick={addField}
          disabled={imageFields.some((field) => field === "")}
        >
          Add Image
        </Button>
      </CardContent>
      <CardFooter className="editor__footer">
        <div className="editor__footer__show-preview">
          <Switch
            className="editor__footer__show-preview--switch"
            id="preview"
            checked={showPreview}
            onClick={handlePreviewSwitch}
          />
          <Label
            htmlFor="airplane-mode"
            className="editor__footer_switch__label"
          >
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
            <MarkdownDisplay markdown={postBody} />
          </CardContent>
          <hr />
        </>
      ) : null}
    </Card>
  );
};

export default CreatePost;
