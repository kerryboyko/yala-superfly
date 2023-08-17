import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useOutletContext } from "react-router";
import { HomePage } from "~/components/Home/HomePage";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import { useLoaderData } from "@remix-run/react";
import postSummaryStyles from "~/styles/post-summary.css";
import aboutStyles from "~/styles/about.css";
import voterStyles from "~/styles/post-votes.css";
import {
  findHottestPosts,
  findHottestSubscribedPosts,
} from "~/modules/postLists";

export const links: LinksFunction = linkFunctionFactory(
  aboutStyles,
  postSummaryStyles,
  voterStyles,
);

const defaultPagination: Pagination = {
  perPage: 25,
  pageNum: 1,
};
export const loader: LoaderFunction = async ({ request }) => {
  const queryParams = grabQueryParams(request.url);
  const pagination = Object.assign({}, defaultPagination, queryParams);
  const skip = Math.max(0, (pagination.pageNum - 1) * pagination.perPage);
  const authUser = await getAuthSession(request);
  const dbQueryParams = {
    userId: authUser?.userId,
    pagination: { skip, perPage: pagination.perPage },
  };
  const query = authUser?.userId
    ? findHottestSubscribedPosts
    : findHottestPosts;
  const posts = await query(dbQueryParams);

  return json({ posts });
};

export default function IndexRoute() {
  const { isLoggedIn } = useOutletContext<{ isLoggedIn: boolean }>();
  const data = useLoaderData();
  return (
    <div className="framing">
      <HomePage posts={data.posts} isLoggedIn={isLoggedIn} />
    </div>
  );
}
