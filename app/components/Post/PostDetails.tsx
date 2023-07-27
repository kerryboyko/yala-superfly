import { Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { getAuthorRoute, getCommunityLink } from "~/logic/getPostLinks";
import { format } from "date-fns";
import { Link as LinkIcon } from "lucide-react";
import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import PostTools from "./PostTools";

interface PostDetails {
  createdAt: string;
  updatedAt: string;
  title: string;
  text?: string | null;
  link?: string | null;
  embeds?: string | null;
  community: {
    name: string;
    route: string;
  };
  author: {
    username: string;
  };
  authorIsThisUser: boolean;
  userModeratesThisCommunity: boolean;
}

export const PostDetails = ({
  createdAt,
  updatedAt,
  title,
  text,
  link,
  embeds,
  community,
  author,
  authorIsThisUser,
  userModeratesThisCommunity,
}: PostDetails) => {
  const allEmbeds = embeds?.split(";");
  return (
    <Card className="post-details">
      <CardHeader className="post-details__header">
        <CardTitle className="post-details__title">
          {link ? (
            <div className="post-details__title-link">
              <Link className="post-details__title-link--literal" to={link}>
                {title}
              </Link>
            </div>
          ) : (
            <div className="post-details__title-text">{title}</div>
          )}
        </CardTitle>
        <CardDescription>
          <div className="post-details__description">
            Posted {format(new Date(createdAt), "d MMM, u - h:mm a")} to{" "}
            <Link to={getCommunityLink({ communityRoute: community.route })}>
              /community/{community.name}
            </Link>{" "}
            by{" "}
            <Link to={getAuthorRoute({ author: author.username })}>
              {author.username}
            </Link>
            {updatedAt && createdAt !== updatedAt ? (
              <div>
                Last updated: {format(new Date(updatedAt), "d MMM, u - h:mm a")}
              </div>
            ) : null}
          </div>
          {link ? (
            <Link className="post-details__link--literal" to={link}>
              <div className="post-details__link">
                <LinkIcon className="link-icon" size="1rem" />
                {link}
              </div>
            </Link>
          ) : null}
        </CardDescription>
        <PostTools
          isModerator={userModeratesThisCommunity}
          isAuthor={authorIsThisUser}
        />
      </CardHeader>
      {text || embeds ? (
        <CardContent className="post-details__content">
          {embeds && Array.isArray(allEmbeds)
            ? allEmbeds?.map((embed: string, idx: number) => (
                <div key={embed} className="post-details__content__embed">
                  <img
                    alt=""
                    className="post-details__content__embed--image"
                    src={embed}
                  />
                </div>
              ))
            : null}
          {text ? (
            <MarkdownDisplay
              className="post-details__content__text"
              markdown={text}
            />
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
};

export default PostDetails;
