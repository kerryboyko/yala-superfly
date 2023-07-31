import React, { type ReactElement } from "react";

export const FormatMarkdownFile = ({
  children,
}: {
  children: ReactElement[] | ReactElement;
}) => (
  <div className="markdown-file__container">
    <div className="markdown-display markdown-file">{children}</div>
  </div>
);

export default FormatMarkdownFile;
