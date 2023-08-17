import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { HottestPosts } from "~/components/Home/HottestPosts";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import postSummaryStyles from "~/styles/post-summary.css";
import aboutStyles from "~/styles/about.css";
import voterStyles from "~/styles/post-votes.css";
import { findNewestPosts } from "~/modules/postLists";
import { PostList } from "~/components/Home/PostList";
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
  const posts = await findNewestPosts({
    userId: authUser?.userId,
    pagination: { skip, perPage: pagination.perPage },
  });

  return json({ posts });
};

export default function HottestPostsPage() {
  const { posts }: any = useLoaderData();
  return (
    <div className="framing">
      <PostList
        className="home-page-like"
        title="Newest posts from our communities"
        posts={posts}
      />
    </div>
  );
}
