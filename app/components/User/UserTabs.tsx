import { NavLink } from "@remix-run/react";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";

export interface UserTabsProps {
  username: string;
  profile: {
    userId: string;
    createdAt: string; // DateTime,
    bannedUntil: string | null | undefined; // DateTime,
    memberships: string[];
    _count: {
      comments: number;
      posts: number;
      moderates: number;
      subscribes: number;
    };
  };
  isThisUser: boolean;
}

type slug = [string, string]; // [routeslug, Label];

export const UserTabs = ({ username, profile, isThisUser }: UserTabsProps) => {
  const SLUGS: Record<keyof typeof profile._count, slug> = {
    comments: ["comments", "Comments"],
    posts: ["posts", "Posts"],
    moderates: ["moderation", "Moderation"],
    subscribes: ["subscriptions", "Subscriptions"],
  };
  return (
    <div className="user-nav-tabs">
      <div className="user-nav-tabs__container">
        <NavLink
          key={"overview"}
          to={`/user/${username}`}
          className="user-nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div
              className={`user-nav-tabs__tab ${isActive ? "is-active" : ""}`}
            >
              <div className="user-nav-tabs__label">Overview</div>
            </div>
          )}
        </NavLink>
        {(
          [
            "posts",
            "comments",
            "subscribes",
            "moderates",
          ] as (keyof typeof profile._count)[]
        ).map((key: keyof typeof profile._count) => (
          <NavLink
            key={key}
            to={`/user/${username}/${SLUGS[key][0]}`}
            className="user-nav-tabs--link"
            end
          >
            {({ isActive }) => (
              <div
                className={`user-nav-tabs__tab ${isActive ? "is-active" : ""}`}
              >
                <div className="user-nav-tabs__label">{SLUGS[key][1]}</div>
                {profile._count[key] > 0 ? (
                  <div
                    className={`user-nav-tabs__count ${
                      isActive ? "is-active" : ""
                    }`}
                  >
                    {profile._count[key]}
                  </div>
                ) : null}
              </div>
            )}
          </NavLink>
        ))}
        {isThisUser ? (
          <NavLink
            key={"messages"}
            to={`/user/${username}/messages`}
            className="user-nav-tabs--link"
            end
          >
            {({ isActive }) => (
              <div
                className={`user-nav-tabs__tab ${isActive ? "is-active" : ""}`}
              >
                <div className="user-nav-tabs__label">Messages</div>
              </div>
            )}
          </NavLink>
        ) : null}
      </div>
    </div>
  );
};
