import { Link } from "@remix-run/react";
import { FileEdit } from "lucide-react";

import editPostButtonStyles from "~/styles/edit-post-button.css";

import DeletePostButton, {
  styles as deletePostButtonStyles,
} from "./DeletePostButton";

export const styles = [editPostButtonStyles, deletePostButtonStyles];

export const PostTools = ({
  isAuthor,
  isModerator,
  communityRoute,
  postId,
  postTitle,
}: {
  isAuthor?: boolean;
  isModerator?: boolean;
  communityRoute: string;
  postId: string | number;
  postTitle?: string;
}) => (
  <div className="post-tools">
    {isAuthor ? (
      <Link to={`/community/${communityRoute}/post/edit/${postId}`}>
        <div className="edit-post-button">
          <FileEdit className="edit-post-button--icon" />
          Edit
        </div>
      </Link>
    ) : null}
    {isAuthor || isModerator ? (
      <div className="post-tools__command">
        <DeletePostButton
          communityRoute={communityRoute}
          postId={postId}
          postTitle={postTitle}
        />
      </div>
    ) : null}
    {/* {isModerator ? (
        <div className="post-tools__command">
          <s>Lock</s>
        </div>
      ) : null} */}
  </div>
);

export default PostTools;
