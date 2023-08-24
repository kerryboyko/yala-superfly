import createCommentTree from "./createCommentTree";
import type { Comment } from "~/types/comments";

const makeComment = (id: number, parentId: number | null = null) => ({
  id,
  parentId,
});

const testComments = [
  makeComment(1),
  makeComment(2),
  makeComment(3),
  makeComment(4),
  makeComment(5, 1),
  makeComment(6, 1),
  makeComment(7, 5),
  makeComment(8, 3),
];

describe("createCommentTree", () => {
  it("creates a heiarchy of comments from a flattened array from the database", () => {
    expect(createCommentTree(testComments as any)).toEqual([
      {
        childComments: [
          {
            childComments: [
              {
                childComments: [],
                comment: {
                  id: 7,
                  parentId: 5,
                },
              },
            ],
            comment: {
              id: 5,
              parentId: 1,
            },
          },
          {
            childComments: [],
            comment: {
              id: 6,
              parentId: 1,
            },
          },
        ],
        comment: {
          id: 1,
          parentId: null,
        },
      },
      {
        childComments: [],
        comment: {
          id: 2,
          parentId: null,
        },
      },
      {
        childComments: [
          {
            childComments: [],
            comment: {
              id: 8,
              parentId: 3,
            },
          },
        ],
        comment: {
          id: 3,
          parentId: null,
        },
      },
      {
        childComments: [],
        comment: {
          id: 4,
          parentId: null,
        },
      },
    ]);
  });
});
