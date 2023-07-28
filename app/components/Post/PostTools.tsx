import { Link } from "@remix-run/react";
import DeletePostButton, {
  styles as deletePostButtonStyles,
} from "./DeletePostButton";
import editPostButtonStyles from "~/styles/edit-post-button.css";
import { FileEdit } from "lucide-react";

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
}) => {
  return (
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
      {isModerator ? (
        <div className="post-tools__command">
          <s>Lock</s>
        </div>
      ) : null}
      <div className="post-tools__command">
        <s>Share</s>
      </div>
    </div>
  );
};

export default PostTools;
