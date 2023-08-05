import { ChangeEventHandler, useMemo, useState } from "react";
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
  const [tempValue, setTempValue] = useState<string>("");
  const isDirty = useMemo(() => value !== tempValue, [value, tempValue]);
  const saveData = () => editField(tempValue);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) =>
    setTempValue(event.target.value);
  return (
    <div>
      <div className="post-image">
        <img src={value} className="post-image__preview" />
      </div>
      <div>
        <Input
          name="image-input-field"
          value={tempValue}
          onChange={handleChange}
        />
        <input type="hidden" name="images" value={value} />
      </div>
      <Button type="button" disabled={!isDirty} onClick={saveData}>
        {!isDirty && tempValue !== "" ? "Saved" : "Save/Update"}
      </Button>
      <Button type="button" onClick={removeField}>
        Delete
      </Button>
    </div>
  );
};
