import { Link } from "@remix-run/react";
import { format } from "date-fns";
import { Link as LinkIcon } from "lucide-react";

import { MarkdownDisplay } from "~/components/Markdown/MarkdownDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { getAuthorRoute, getCommunityLink } from "~/logic/getPostLinks";
import postDetailsStyles from "~/styles/post-details.css";

import PostImage, { styles as postImageStyles } from "./PostImage";
import PostTools, { styles as postToolsStyles } from "./PostTools";
import Voter, { styles as voterStyles } from "../Votes/Voter";

export const styles = [postDetailsStyles, voterStyles]
  .concat(postToolsStyles)
  .concat(postImageStyles);

interface PostDetails {
  createdAt: string;
  updatedAt: string;
  title: string;
  text?: string | null;
  link?: string | null;
  community: {
    name: string;
    route: string;
  };
  author: {
    username: string;
  };
  authorIsThisUser: boolean;
  userIsModerator: boolean;
  postId: number | string;
  voteCount?: number | null;
  userVoted?: number | null;
  images?: string[];
}

export const PostDetails = ({
  createdAt,
  updatedAt,
  title,
  text,
  link,
  community,
  author,
  authorIsThisUser,
  userIsModerator,
  postId,
  voteCount,
  userVoted,
  images,
}: PostDetails) => (
  <Card className="post-details">
    <CardHeader className="post-details__header">
      <div className="post-details__header-box">
        <Voter
          votes={voteCount}
          userVoted={userVoted}
          id={Number(postId)}
          isComment={false}
        />
        <div className="post-details__title-box">
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
              Posted {format(new Date(createdAt), "d MMMM, u - h:mm a")} to{" "}
              <Link to={getCommunityLink({ communityRoute: community.route })}>
                /community/{community.name}
              </Link>{" "}
              by{" "}
              <Link to={getAuthorRoute({ author: author.username })}>
                {author.username}
              </Link>
              {updatedAt && createdAt !== updatedAt ? (
                <div>
                  Last updated:{" "}
                  {format(new Date(updatedAt), "d MMMM, u - h:mm a")}
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
        </div>
      </div>
    </CardHeader>
    {text || images ? (
      <CardContent className="post-details__content">
        {images && Array.isArray(images)
          ? images.map((src: string, idx: number) => (
              <PostImage key={`${idx}-${src}`} src={src} />
            ))
          : null}
        {text ? (
          <MarkdownDisplay
            className="post-details__content__text"
            markdown={text}
          />
        ) : null}
        <PostTools
          postTitle={title}
          isModerator={userIsModerator}
          isAuthor={authorIsThisUser}
          communityRoute={community.route}
          postId={postId}
        />
      </CardContent>
    ) : null}
  </Card>
);

export default PostDetails;
