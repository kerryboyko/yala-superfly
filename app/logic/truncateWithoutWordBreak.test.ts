import { truncateWithoutWordBreak } from "./truncateWithoutWordBreak";

const sample = `We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.`;

describe("truncateWithoutWordBreak()", () => {
  it("truncates without word breaks", () => {
    expect(truncateWithoutWordBreak(sample)).toBe(
      "We the People of the United States, in Order to form…",
    );
    for (let i = 95; i < 101; i++) {
      expect(truncateWithoutWordBreak(sample, i)).toBe(
        "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure…",
      );
    }

    expect(truncateWithoutWordBreak(sample, 94)).toBe(
      "We the People of the United States, in Order to form a more perfect Union, establish Justice,…",
    );
  });
});
