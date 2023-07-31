import type { ChangeEventHandler } from "react";
import { useState } from "react";

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

export const CreatePost = () => {
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postLink, setPostLink] = useState<string>("");
  const [postBody, setPostBody] = useState<string>("");

  const togglePreview = () => setShowPreview((state) => !state);

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
          name="post-title"
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
          name="post-link"
          type="text"
          onChange={handlePostLink}
          value={postLink}
        />
      </CardContent>
      {/* <div className="create-post__content__image">
         <CardHeader className="header__condensed-padding bottom top">
          <CardTitle>Image Upload (optional)</CardTitle>
        </CardHeader> 
        <CardContent className="content__condensed-padding">
          {postEmbed ? (
            <div className="create-post__content__embed-image__display">
              <img
                className="create-post__content__embed-image__display--image"
                alt=""
                width={"250px"}
                src={postEmbed}
              />
              <Button type="button" onClick={handleDeleteImage}>
                Remove
              </Button>
              <input type="hidden" name="image-embed" value={postEmbed} />
            </div>
          ) : isUploading ? (
            <div className="create-post__content__embed-image__loading">
              <Loader2
                size={"1.5rem"}
                className="create-post__content__embed-image__loading icon"
              />
              Uploading, please wait...
            </div>
          ) : (
            <DragDropFile size="small" handleFiles={handleImageFile} />
          )}
        </CardContent> 
      </div> */}
      <CardHeader className="editor__header header__condensed-padding bottom top">
        <CardTitle className="editor__header__title">Text (optional)</CardTitle>
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
        <Button className="editor__footer__button-submit" type="submit">
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

export default CreatePost;
