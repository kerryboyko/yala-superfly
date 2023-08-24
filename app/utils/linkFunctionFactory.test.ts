import { linkFunctionFactory } from "./linkFunctionFactory";

describe("linkFunctionFactory()", () => {
  it("creates a list of stylesheets", () => {
    const ss = ["foo", "bar", "baz", "quuz"];
    const result = linkFunctionFactory(...ss);
    expect(typeof result).toBe("function");
    expect(result()).toEqual([
      {
        href: "foo",
        rel: "stylesheet",
      },
      {
        href: "bar",
        rel: "stylesheet",
      },
      {
        href: "baz",
        rel: "stylesheet",
      },
      {
        href: "quuz",
        rel: "stylesheet",
      },
    ]);
  });

  it("should remove duplicates and deal with nested arrays", () => {
    const ss = ["foo", "bar", ["baz", "quuz", ["foo", "baz"]]];
    const result = linkFunctionFactory(...ss);
    expect(typeof result).toBe("function");
    expect(result()).toEqual([
      {
        href: "foo",
        rel: "stylesheet",
      },
      {
        href: "bar",
        rel: "stylesheet",
      },
      {
        href: "baz",
        rel: "stylesheet",
      },
      {
        href: "quuz",
        rel: "stylesheet",
      },
    ]);
  });
});
