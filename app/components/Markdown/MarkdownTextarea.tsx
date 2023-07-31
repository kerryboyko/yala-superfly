import type { ChangeEventHandler } from "react";
import { useMemo, useState } from "react";

import type { Value } from "@prisma/client/runtime";

import { Textarea } from "~/components/ui/textarea";

export interface MarkdownTextareaProps {
  name: string;
  placeholder?: string;
  className?: string;
  header?: string | null;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  [key: string]: Value;
}

export const MarkdownTextarea = ({
  name = "markdown-editor",
  placeholder,
  className = "markdown-editor",
  header = null,
  value,
  onChange,
  ...rest
}: MarkdownTextareaProps) => {
  const [commentText, setCommentText] = useState<string>("");

  const fromRootClassName = (str: string, postfix: string = "", prefix = "") =>
    `${prefix} markdown-editor ${str}${postfix}`.trim();

  const handleTextareaChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => (onChange ? onChange(event) : setCommentText(event.target.value));

  const computeValue = useMemo(() => {
    if (value !== undefined) {
      return value;
    }
    return commentText;
  }, [value, commentText]);

  return (
    <div className={fromRootClassName(className)}>
      <div className={fromRootClassName(className, "__intro")}>
        {header}

        <div
          className={fromRootClassName(className, "__edit", "input-container")}
        >
          <div
            className={fromRootClassName(
              className,
              "--isSupported",
              "is-supported",
            )}
          >
            <a
              href="https://www.markdownguide.org/cheat-sheet/"
              target="_blank"
              rel="noreferrer"
            >
              Markdown
            </a>{" "}
            is supported.
          </div>
          <Textarea
            className={fromRootClassName(className, "__textarea", "input")}
            placeholder={placeholder}
            value={computeValue}
            onChange={handleTextareaChange}
            name={name}
            {...rest}
          />
        </div>
      </div>
    </div>
  );
};

export default MarkdownTextarea;
