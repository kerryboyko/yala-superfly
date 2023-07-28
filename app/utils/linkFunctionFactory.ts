import { LinksFunction } from "@remix-run/server-runtime";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";

export const linkFunctionFactory =
  (...stylesheets: any[]): LinksFunction =>
  () =>
    uniq(flatten(stylesheets)).map((href: string) => ({
      rel: "stylesheet",
      href,
    }));
