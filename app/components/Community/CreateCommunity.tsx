import React, { useMemo, useState } from "react";

import { MarkdownTextarea } from "~/components/Markdown/MarkdownTextarea";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "~/components/ui/custom/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";
import { formatCommunityName } from "~/logic/formatCommunityName";

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
            Your community will be accessible at /community/
            {formattedCommunityShortName}
          </div>
        </div>

        <div className="create-community__content__description grid gap-2">
          <Label
            htmlFor="communityDescription"
            className="create-community__content__description label"
          >
            Description
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
      </CardContent>
      <CardFooter className="create-community__footer">
        <Button type="submit">Create Community</Button>
      </CardFooter>
      <input
        type="hidden"
        name="communityRoute"
        value={formattedCommunityShortName}
      />
    </Card>
  );
};

export default CreateCommunityForm;
