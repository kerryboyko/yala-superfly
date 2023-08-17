import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import { useLoaderData } from "@remix-run/react";
import postSummaryStyles from "~/styles/post-summary.css";
import aboutStyles from "~/styles/about.css";
import voterStyles from "~/styles/post-votes.css";
import { countCommunities, findPopularCommunities } from "~/modules/postLists";
import Subscription, {
  styles as subscriptionStyles,
} from "~/components/Subscription/Subscription";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";
import Paginator from "~/components/Paginator/Paginator";
export const links: LinksFunction = linkFunctionFactory(
  aboutStyles,
  postSummaryStyles,
  voterStyles,
  subscriptionStyles,
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
  const numCommunities = await countCommunities();

  const popularCommunities = await findPopularCommunities({
    userId: authUser?.userId,
    pagination: { perPage: pagination.perPage, skip },
  });
  return json({ popularCommunities, numCommunities, pagination });
};

export default function PopularCommunitiesRoute() {
  const data = useLoaderData();
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const toggleShowDescription = () =>
    setShowDescription((state: boolean) => !state);

  return (
    <div className="framing">
      <div className="home-page-like">
        <Card>
          <CardHeader>
            <Button className="button" onClick={toggleShowDescription}>
              {showDescription ? "Hide Descriptions" : "Show Descriptions"}
            </Button>
            <CardTitle>Most Popular Communities:</CardTitle>
          </CardHeader>
          <CardContent className="user-subscribes__card__content">
            {data.popularCommunities.map((popCom: any) => (
              <Subscription
                key={popCom.communityRoute}
                communityRoute={popCom.route}
                communityName={popCom.name}
                communityDescription={popCom.description || ""}
                numPosts={popCom._count.posts}
                numComments={popCom._count.comments}
                isSubscribed={popCom.isSubscribed}
                showDescription={showDescription}
              />
            ))}
          </CardContent>
          <Paginator
            perPage={data.pagination.perPage}
            currentPage={data.pagination.pageNum}
            totalCount={data.numCommunities}
          />
        </Card>
      </div>
    </div>
  );
}
