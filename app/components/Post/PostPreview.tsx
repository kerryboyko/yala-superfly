import PostImage from "./PostImage";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import { CardContent } from "../ui/card";

export const PostPreview = ({
  postTitle,
  postLink,
  imageFields,
  postBody,
}: {
  postTitle: string;
  postLink?: string;
  imageFields?: string[];
  postBody?: string;
}) => (
  <div>
    <hr />
    <CardContent className="post-preview">
      {postTitle ? (
        <div className="post-preview__title">
          {postLink ? (
            <a
              className="post-preview__link"
              href={postLink}
              target="_blank"
              rel="noreferrer"
            >
              {postTitle}
            </a>
          ) : (
            postTitle
          )}
        </div>
      ) : null}
      {imageFields && imageFields.length > 0
        ? imageFields.map((src, idx) => (
            <PostImage key={`${src}-${idx}`} src={src} />
          ))
        : null}
      <MarkdownDisplay markdown={postBody} />
    </CardContent>
    <hr />
  </div>
);
