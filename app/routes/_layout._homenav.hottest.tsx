import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { format } from "date-fns";
import { useLoaderData } from "react-router";

import { HottestPosts } from "~/components/Home/HottestPosts";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import { countPosts, findHottestPosts } from "~/modules/postLists";
import aboutStyles from "~/styles/about.css";
import postSummaryStyles from "~/styles/post-summary.css";
import voterStyles from "~/styles/post-votes.css";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
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
  const numPosts = await countPosts();
  const posts = await findHottestPosts({
    userId: authUser?.userId,
    pagination: { skip, perPage: pagination.perPage },
  });

  return json({
    posts: posts.map((p) => ({
      ...p,
      createdAt: format(new Date(p.createdAt), "d MMMM, u - h:mm a"),
    })),
    pagination,
    numPosts,
  });
};

export default function HottestPostsPage() {
  const { posts, pagination, numPosts }: any = useLoaderData();
  return (
    <div className="framing">
      <HottestPosts posts={posts} pagination={pagination} numPosts={numPosts} />
    </div>
  );
}
