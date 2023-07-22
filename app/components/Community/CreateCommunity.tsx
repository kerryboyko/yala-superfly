import React, { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { MarkdownTextarea } from "~/components/Markdown/MarkdownTextarea";

import { Label } from "~/components/ui/label";

import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";
import { formatCommunityName } from "~/logic/formatCommunityName";
import { DragDropFile } from "../DragDropFile/DragDropFile";
import { Loader2 } from "lucide-react";

const safetyCountClass = (
  text: string,
  maxChars: number,
): { count: number; remaining: number; className: string } => {
  const l = text.length;
  const remaining = maxChars - l;
  let className = "";
  if (remaining / maxChars <= 0.1) {
    className = "warning-red";
  } else if (remaining / maxChars <= 0.2) {
    className = "safety-orange";
  }
  return { count: l, remaining, className };
};

const inputHandler =
  (
    setter: React.Dispatch<React.SetStateAction<string>>,
    limit: number,
  ): React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> =>
  (event) => {
    if (event.target.value.length <= limit) {
      setter(event.target.value);
    }
  };

export const CreateCommunityForm = ({
  errors,
}: {
  errors?: Record<string, string>;
}) => {
  const [communityName, setCommunityName] = useState<string>("");
  const [communityDescription, setCommunityDescription] = useState<string>("");
  const [headerImage, setHeaderImage] = useState<string>("");
  const [deleteHashCode, setDeleteHashCode] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const formattedCommunityShortName = useMemo(
    (): string => formatCommunityName(communityName),
    [communityName],
  );

  const nameChars = useMemo(
    () =>
      safetyCountClass(
        formattedCommunityShortName,
        COMMUNITY_NAME_CHAR_LIMITS.communityName,
      ),
    [formattedCommunityShortName],
  );
  const descriptionChars = useMemo(
    () =>
      safetyCountClass(
        communityDescription,
        COMMUNITY_NAME_CHAR_LIMITS.description,
      ),
    [communityDescription],
  );

  const handleName = inputHandler(
    setCommunityName,
    COMMUNITY_NAME_CHAR_LIMITS.communityName,
  );
  const handleDescription = inputHandler(
    setCommunityDescription,
    COMMUNITY_NAME_CHAR_LIMITS.description,
  );

  const handleImageFile = async (fileList: any) => {
    setIsUploading(true);
    try {
      const result = await fetch("/api/v1/upload-to-imgur", {
        method: "post",
        body: fileList,
      });

      const json = await result.json();
      const { link, deletehash } = json;

      setHeaderImage(link);
      setDeleteHashCode(deletehash);
      setIsUploading(false);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await fetch(`/api/v1/delete-from-imgur/${deleteHashCode}`, {
        method: "post",
      });
      setHeaderImage("");
      setDeleteHashCode("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="create-community">
      <CardHeader className="create-community__header space-y-1">
        <CardTitle className="create-community__header__title text-2xl">
          Create a community
        </CardTitle>
        <CardDescription className="create-community__header__description">
          Create your community below. Fields marked with an asterisk are
          required.
        </CardDescription>
      </CardHeader>
      <CardContent className="create-community__content grid gap-4">
        <div className="create-community__content__name grid gap-2">
          <Label
            htmlFor="communityName"
            className="create-community__content__name__label label"
          >
            Community Name
          </Label>
          <div className="create-community__content__name__input-container input-container">
            <Input
              name="communityName"
              className="create-community__content__name__input input"
              id="communityName"
              type="text"
              placeholder={"Enter a community name here"}
              value={communityName}
              onChange={handleName}
            />
            <div
              className={`create-community__content__name__char-count char-count ${nameChars.className}`}
            >
              {nameChars.remaining}
            </div>
          </div>
          {errors ? (
            <div className="create-community__content__name--error warning-red text-sm">
              {errors.communityName || errors.communityRoute}
            </div>
          ) : null}

          <div className="create-community__content__shortname__route-display text-sm">
            Your community will be accessible at /dashboard/community/
            {formattedCommunityShortName}
          </div>
        </div>

        <div className="create-community__content__description grid gap-2">
          <Label
            htmlFor="communityDescription"
            className="create-community__content__description label"
          >
            Description|
          </Label>
          <div className="create-community__content__description__input-container input-container">
            <MarkdownTextarea
              name="communityDescription"
              className="create-community__content__description input"
              id="communityDescription"
              placeholder={"Enter a brief description of your community"}
              value={communityDescription}
              onChange={handleDescription}
            />
            <div
              className={`create-community__content__description char-count ${descriptionChars.className}`}
            >
              {descriptionChars.remaining}
            </div>
          </div>
          {errors?.communityDescription ? (
            <div className="create-community__content__name--error warning-red text-sm">
              {errors.communityDescription}
            </div>
          ) : null}
        </div>
        <div className="create-community__content__description grid gap-2">
          <Label className="create-community__content__description label">
            Header Image
          </Label>
          {headerImage ? (
            <div className="create-community__content__header-image__display">
              <img
                className="create-community__content__header-image__display--image"
                alt="not found"
                width={"250px"}
                src={headerImage}
              />
              <Button type="button" onClick={handleDeleteImage}>
                Remove
              </Button>
            </div>
          ) : isUploading ? (
            <div className="create-community__content__header-image__loading">
              <Loader2
                size={"1.5rem"}
                className="create-community__content__header-image__loading icon"
              />
              Uploading, please wait...
            </div>
          ) : (
            <DragDropFile handleFiles={handleImageFile} />
          )}
        </div>

        <div className="create-community__content__image-file--notice text-xs">
          (Image files are hosted at Imgur.com. An S3 solution may be available
          in the future.)
        </div>
      </CardContent>
      <CardFooter className="create-community__footer">
        <Button type="submit">Create Community</Button>
      </CardFooter>
      <input
        type="hidden"
        name="communityRoute"
        value={formattedCommunityShortName}
      />
      <input type="hidden" name="headerImage" value={headerImage} />
    </Card>
  );
};

export default CreateCommunityForm;
