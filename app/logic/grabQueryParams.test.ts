import { grabQueryParams } from "./grabQueryParams";

describe("grabQueryParams()", () => {
  it("grabs the query params from a url", () => {
    const testUrl = `http://yala.com/community/startrek/post/32?movies=13&goodones=about-half`;
    expect(grabQueryParams(testUrl)).toEqual({
      goodones: "about-half",
      movies: 13,
    });
  });
});
