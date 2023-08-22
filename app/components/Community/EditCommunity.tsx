import type { ChangeEventHandler } from "react";
import { useCallback, useState } from "react";

import { Loader2, PenSquare } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";

import DragDropFile from "../DragDropFile/DragDropFile";
import MarkdownTextarea from "../Markdown/MarkdownTextarea";
import { Label } from "../ui/label";

export const styles = [];

export const EditCommunity = ({
  initialDescription,
  initialHeaderImage,
  loadingState,
}: {
  initialDescription: string;
  initialHeaderImage: string;
  loadingState: "idle" | "submitting" | "loading";
}) => {
  const [description, setDescription] = useState<string>(initialDescription);

  const handleDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> =
    useCallback(
      (event) => {
        setDescription(event.target.value);
      },
      [setDescription],
    );

  return (
    <Card className="edit-community">
      <CardHeader className="editor__header header__condensed-padding bottom top">
        <CardTitle className="editor__header__title">Edit Community</CardTitle>
      </CardHeader>
      <CardContent className="editor__content">
        <CardDescription>
          <Label
            htmlFor="edit-description"
            className="editor__content__description label"
          >
            Community Description: (optional)
          </Label>
        </CardDescription>
        <MarkdownTextarea
          className="editor__content__editor"
          placeholder={"Type your description here"}
          onChange={handleDescriptionChange}
          value={description}
          name="communityDescription"
        />
        <CardDescription>
          <Label
            htmlFor="header-image"
            className="editor__content__header-image label"
          >
            Header Image (optional)
          </Label>
          <div>
            <div className="text-sm">
              Header images must be no more than 512kb, and must be a jpeg, gif,
              png, or webp file.
            </div>
          </div>
        </CardDescription>
        <DragDropFile initialHeaderImage={initialHeaderImage} />
      </CardContent>

      <CardFooter className="editor__footer">
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
    </Card>
  );
};

export default EditCommunity;
