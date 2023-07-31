import type { DragEventHandler } from "react";
import { useCallback, useRef, useState } from "react";

export const DragDropFile = ({
  dragAndDropLabel = `Drag and drop your file here or`,
  uploadButtonLabel = `Upload a file`,
  handleFiles,
  size = "normal",
}: {
  bucket: string;
  dragAndDropLabel?: string;
  uploadButtonLabel?: string;
  handleFiles: (f: any[]) => void;
  size?: string;
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleDrag: DragEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.type === "dragenter" || event.type === "dragover") {
        setDragActive(true);
      } else if (event.type === "dragleave") {
        setDragActive(false);
      }
    },
    [setDragActive],
  );

  const handleDrop = function (event: any) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFiles(event.dataTransfer.files[0]);
    }
  };

  const handleChange = function (event: any) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFiles(event.target.files[0]);
    }
  };

  return (
    <div
      id="form-file-upload"
      className={`size--${size}`}
      onDragEnter={handleDrag}
    >
      <input
        type="file"
        id="input-file-upload"
        name="input-file-upload"
        multiple={false}
        onChange={handleChange}
        ref={inputRef}
      />
      <label
        id="label-file-upload"
        className={`size--${size}`}
        htmlFor="input-file-upload"
      >
        <div>
          <p>{dragAndDropLabel}</p>
          <button
            type="button"
            onClick={onButtonClick}
            className={`size--${size} upload-button`}
          >
            {uploadButtonLabel}
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          className={`size--${size}`}
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </div>
  );
};

export default DragDropFile;
