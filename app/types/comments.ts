export interface Comment {
  id: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author: {
    username: string;
  };
  parentId: number | string | null;
  postId: number;
  community: {
    route: string;
  };
  text: string;
  voteCount?: number | null;
  userVoted?: number | null;
}

export interface RecursiveCommentTreeNode {
  comment: Comment;
  childComments: RecursiveCommentTreeNode[];
}
