import type { ReactElement } from "react";
import { useMemo } from "react";

import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";

const mdToHTML = (markdownString: string): string =>
  sanitize(
    marked.parse(markdownString, { mangle: false, headerIds: false }),
  ).trim();

export const MarkdownDisplay = ({
  markdown = "",
  className,
  children,
  ...others
}: {
  markdown: string;
  className?: string;
  children?: ReactElement;
  others?: any[];
}) => {
  const html = useMemo(() => mdToHTML(markdown), [markdown]);
  if (children) {
    console.warn(
      `Cannot set children in Markdown Display. Please use the markdown={markdown} prop`,
    );
  }
  return (
    <div
      className={`${className} markdown-display`}
      {...others}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownDisplay;
