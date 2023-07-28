import DeletePostButton, {
  styles as deletePostButtonStyles,
} from "./DeletePostButton";

export const styles = deletePostButtonStyles;

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
        <div className="post-tools__command">
          <s>Edit</s>
        </div>
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
