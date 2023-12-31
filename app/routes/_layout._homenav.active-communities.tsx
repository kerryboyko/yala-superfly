import { useState } from "react";

import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Paginator from "~/components/Paginator/Paginator";
import Subscription, {
  styles as subscriptionStyles,
} from "~/components/Subscription/Subscription";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { CardTitle } from "~/components/ui/custom/card";
import { grabQueryParams } from "~/logic/grabQueryParams";
import { getAuthSession } from "~/modules/auth/session.server";
import { countCommunities, findActiveCommunities } from "~/modules/postLists";
import aboutStyles from "~/styles/about.css";
import postSummaryStyles from "~/styles/post-summary.css";
import voterStyles from "~/styles/post-votes.css";
import type { Pagination } from "~/types/posts";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

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
  const activeCommunities = await findActiveCommunities({
    userId: authUser?.userId,
    pagination: { perPage: pagination.perPage, skip },
  });
  return json({ activeCommunities, numCommunities, pagination });
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
            <Button
              className="button show-descriptions"
              onClick={toggleShowDescription}
            >
              {showDescription ? "Hide Descriptions" : "Show Descriptions"}
            </Button>
            <CardTitle>Most Active Communities:</CardTitle>
          </CardHeader>
          <CardContent className="user-subscribes__card__content">
            {data.activeCommunities.map((activeCom: any) => (
              <Subscription
                key={activeCom.communityRoute}
                communityRoute={activeCom.route}
                communityName={activeCom.name}
                communityDescription={activeCom.description || ""}
                numPosts={activeCom._count.posts}
                numComments={activeCom._count.comments}
                isSubscribed={activeCom.isSubscribed}
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
