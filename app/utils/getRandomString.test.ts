import { getRandomB64 } from "./getRandomString";

describe("getRandomB64()", () => {
  it(`generates a random code in B64`, () => {
    expect(getRandomB64()).toHaveLength(14);
    expect(getRandomB64(5)).toHaveLength(7);
    expect(getRandomB64(30)).toHaveLength(40);
  });
});
