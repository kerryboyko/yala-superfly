import type { DragEventHandler } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { XSquare } from "lucide-react";

export const ImagePreview = ({
  file,
  onCancel,
}: {
  file?: File;
  onCancel: () => void;
}) => {
  const [imgUri, setImgUri] = useState<string | ArrayBuffer | null>(null);

  useEffect(() => {
    console.log("useEffectTriggering", file);
    let reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) =>
      setImgUri(ev?.target?.result || null);
    if (file) {
      reader.readAsDataURL(file);
    }
    if (file === null) {
      setImgUri(null);
    }
  }, [file, setImgUri]);

  return typeof imgUri === "string" ? (
    <div className="image-preview">
      <div className="image-preview__image">
        <img className="image-preview__image--image" src={imgUri} />
      </div>
      <Button
        type="button"
        onClick={onCancel}
        className="image-preview__button-cancel"
      >
        <XSquare className="icon" />
      </Button>
    </div>
  ) : null;
};

const checkFileRestrictions = (file: File): string => {
  console.log(file);
  if (
    !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
  ) {
    return `File is not an accepted image type. Accepted types: jpeg, gif, png, webp - Your type: ${
      file.type === "" ? "unknown" : file.type
    }`;
  }
  if (file.size > 524288) {
    return `File Size Exceeds 512kb - Your Size: ${Math.ceil(
      file.size / 1024,
    )}kb`;
  }

  return "";
};

export const DragDropFile = ({
  dragAndDropLabel = `Drag and drop your file here or`,
  uploadButtonLabel = `Upload a file`,
  handleFiles = () => null,
  size = "normal",
}: {
  dragAndDropLabel?: string;
  uploadButtonLabel?: string;
  handleFiles?: (f: any[]) => void;
  size?: string;
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileWarning, setFileWarning] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const checkAndHandleFile = (file: File) => {
    const fileRestrictions = checkFileRestrictions(file);
    setFileWarning(fileRestrictions);
    if (fileRestrictions === "") {
      setFile(file);
      handleFiles([file]);
    }
  };

  const handleDrag: DragEventHandler = useCallback(
    (event) => {
      console.log("handleDrag");

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
      checkAndHandleFile(event.dataTransfer.files[0]);
    }
  };

  const handleInput = function (event: any) {
    console.log("useEffectTriggering");
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      checkAndHandleFile(event.target.files[0]);
    }
  };

  const handleCancel = () => {
    setFile(null);
    handleFiles([null]);
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="drag-drop-file-container">
      <div
        id="form-file-upload"
        className={`size--${!file ? size : "compressed"}`}
        onDragEnter={handleDrag}
      >
        <input
          type="file"
          id="input-file-upload"
          name="input-file-upload"
          multiple={false}
          onInput={handleInput}
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
            {fileWarning !== "" ? (
              <div className="file-warning">{fileWarning}</div>
            ) : null}
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
      <ImagePreview onCancel={handleCancel} file={file} />
    </div>
  );
};

export default DragDropFile;
