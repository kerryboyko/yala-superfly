import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useParams,
  useRouteError,
  Outlet,
  Link,
} from "@remix-run/react";
import { formatRelative } from "date-fns";
import MarkdownDisplay from "~/components/Markdown/MarkdownDisplay";
import { Button } from "~/components/ui/button";
import { db } from "~/database/db.server";
import communityStyles from "~/styles/community.css";

export const links: LinksFunction = () =>
  [communityStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ params }: LoaderArgs) => {
  const community = await db.community.findUnique({
    where: { route: params.route },
    select: {
      createdAt: true,
      headerImage: true,
      description: true,
      name: true,
      route: true,
      createdBy: {
        select: { username: true },
      },
    },
  });
  if (!community) {
    throw new Response("Not found.", {
      status: 404,
    });
  }
  return json({
    community: {
      ...community,
      createdAt: formatRelative(new Date(community.createdAt), Date.now()),
      createdBy: community.createdBy.username,
    },
  });
};

export default function CommunityProfileRoute() {
  const { community } = useLoaderData<typeof loader>();

  return (
    <div className="community">
      <div className="community__sidebar">
        {community.headerImage ? (
          <div className="community__sidebar__header-image">
            <img
              alt={community.name}
              className="community__sidebar__header-image__image"
              src={community.headerImage}
            />
          </div>
        ) : null}
        <div className="community__sidebar__heading">
          <Link to=".">{community.name}</Link>
        </div>
        <div className="community__sidebar__route">
          <Link to=".">/c/{community.route}</Link>
        </div>
        <div className="community__sidebar__created-by">
          Created {community.createdAt}
          <br />
          by{" "}
          <Link to={`/dashboard/user/${community.createdBy}`}>
            {community.createdBy}
          </Link>
        </div>
        <div className="community__sidebar__create-new-post">
          <Link to={`/dashboard/community/${community.route}/create-new-post`}>
            <Button type="button">Create New Post</Button>
          </Link>
        </div>
        <div className="community__sidebar__description">
          <MarkdownDisplay markdown={community.description || ""} />
        </div>
      </div>
      <div className="community__outlet">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const { username } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">Huh? Who the heck is "{username}"?</div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading the profile for "${username}". Sorry.
    </div>
  );
}
