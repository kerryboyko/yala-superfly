import { LinksFunction } from "@remix-run/server-runtime";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";

export const linkFunctionFactory =
  (...stylesheets: any[]): LinksFunction =>
  () =>
    uniq(flattenDeep(stylesheets)).map((href: string) => ({
      rel: "stylesheet",
      href,
    }));
