import { ChangeEventHandler, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ImagePlus, Trash2 } from "lucide-react";

export const PostImageField = ({
  value,
  editField,
  removeField,
}: {
  value: string;
  editField: (value: string) => void;
  removeField: () => void;
}) => {
  const [tempValue, setTempValue] = useState<string>("");
  const isDirty = useMemo(() => value !== tempValue, [value, tempValue]);
  const saveData = () => editField(tempValue);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setTempValue(event.target.value);
  return (
    <div className="post-image-field">
      <div className="post-image-field__preview">
        <img src={value} className="post-image-field__preview--image" />
      </div>
      <div>
        <Input
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
