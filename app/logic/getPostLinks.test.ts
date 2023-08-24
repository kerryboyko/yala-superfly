import {
  getCommentLink,
  getCommunityLink,
  getAuthorRoute,
} from "./getPostLinks";

describe("getPostLinks.ts", () => {
  describe("getCommentLink()", () => {
    it("gets the comment link", () => {
      expect(getCommentLink({ communityRoute: "test", id: 7 })).toEqual(
        `/community/test/post/7`,
      );
    });
  });
  describe("getCommunityLink()", () => {
    it("gets the community link", () => {
      expect(getCommunityLink({ communityRoute: "test" })).toEqual(
        `/community/test`,
      );
    });
  });
  describe("getAuthorRoute()", () => {
    it("gets the author route", () => {
      expect(getAuthorRoute({ author: "test" })).toEqual(`/user/test`);
    });
  });
});
