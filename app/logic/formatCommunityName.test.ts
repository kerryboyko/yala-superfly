import { formatCommunityName } from "./formatCommunityName";

describe("formatCommunityName()", () => {
  it("formats a community name into a community route name", () => {
    expect(
      formatCommunityName("The Wumpus Had Defeated Evil Mister Pilkington!"),
    ).toBe("thewumpushaddefeatedevilmisterpilkington");
  });
});
