import partition from "lodash/partition";
import type { Comment, RecursiveCommentTreeNode } from "~/types/comments";

export const createCommentTree = (
  comments: Comment[],
  parentId: number | null = null,
): RecursiveCommentTreeNode[] => {
  const [topLevel, others] = partition(
    comments,
    (el) => el.parentId === parentId,
  );

  return topLevel.map((topLevelComment) => ({
    comment: topLevelComment,
    childComments: createCommentTree(others, topLevelComment.id),
  }));
};

export default createCommentTree;
