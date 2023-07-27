export const PostTools = ({
  isAuthor,
  isModerator,
}: {
  isAuthor?: boolean;
  isModerator?: boolean;
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
          <s>Delete</s>
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
