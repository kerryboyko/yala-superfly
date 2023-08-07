import type { ChangeEventHandler } from "react";
import { useMemo, useState } from "react";

import { ImagePlus, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const PostImageField = ({
  value,
  editField,
  removeField,
}: {
  value: string;
  editField: (value: string) => void;
  removeField: () => void;
}) => {
  const [tempValue, setTempValue] = useState<string>(value || "");
  const isDirty = useMemo(() => value !== tempValue, [value, tempValue]);
  const saveData = () => editField(tempValue);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setTempValue(event.target.value);
  return (
    <div className="post-image-field">
      <div className="post-image-field__preview">
        <img
          src={value}
          alt={"placeholder"}
          className="post-image-field__preview--image"
        />
      </div>
      <div>
        <Input
          className="post-image-field__input-field"
          name="image-input-field"
          value={tempValue}
          onChange={handleChange}
        />
        <input type="hidden" name="images" value={value} />
      </div>
      <div className="post-image-field__buttons">
        <Button
          type="button"
          className="post-image-field__buttons--button"
          disabled={!isDirty}
          onClick={saveData}
        >
          <ImagePlus className="icon" />
          {!isDirty && tempValue !== "" ? "Saved" : "Save/Update"}
        </Button>
        <Button
          type="button"
          className="post-image-field__buttons--button"
          onClick={removeField}
        >
          <Trash2 className="icon" />
          Delete
        </Button>
      </div>
    </div>
  );
};
