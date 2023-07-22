export interface Comment {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: {
    username: string;
  };
  parentId: number | string | null;
  postId: number;
  community: {
    route: string;
  };
  text: string;
}

export interface RecursiveCommentTreeNode {
  comment: Comment;
  childComments: RecursiveCommentTreeNode[];
}
