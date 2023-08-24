import { stringIsEmail } from "./stringIsEmail";

describe("stringIsEmail()", () => {
  it(`detects if a string is an email address`, () => {
    const emails = [
      "kerry",
      "kerry.boyko@gmail.com",
      "kerry.boyko.gmail.com",
      "kerry.boyko@gmail@youtube.com",
      "@kerrycoder",
      "kerry@",
      "kerrified @ boyko",
    ];

    const fulfilled = emails.filter(stringIsEmail);
    const rejected = emails.filter((x) => !stringIsEmail(x));
    expect(fulfilled).toEqual([`kerry.boyko@gmail.com`]);
    expect(rejected).toMatchInlineSnapshot(`
      [
        "kerry",
        "kerry.boyko.gmail.com",
        "kerry.boyko@gmail@youtube.com",
        "@kerrycoder",
        "kerry@",
        "kerrified @ boyko",
      ]
    `);
  });
});
