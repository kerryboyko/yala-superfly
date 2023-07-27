import { NavLink } from "@remix-run/react";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";
import { I } from "vitest/dist/types-198fd1d9";

export interface UserTabsProps {
  username: string;
  profile: {
    userId: string;
    createdAt: string; // DateTime,
    bannedUntil: string | null | undefined; // DateTime,
    memberships: string[];
    [key: string]: any;
    _count: {
      comments: number;
      posts: number;
      moderates: number;
      subscribes: number;
      [key: string]: number;
    };
  };
  isThisUser: boolean;
}

type slug = [string, string]; // [routeslug, Label];

export const UserTabs = ({ username, profile, isThisUser }: UserTabsProps) => {
  const slugs: Record<string, slug> = {
    comments: ["comments", "Comments"],
    posts: ["posts", "Posts"],
  };
  if (isThisUser) {
    slugs.moderates = ["moderation", "Moderation"];
    slugs.subscribes = ["subscriptions", "Subscriptions"];
  }

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
        {["posts", "comments", "subscribes", "moderates"]
          .filter((key) => Object.keys(slugs).includes(key))
          .map((key: string) => (
            <NavLink
              key={key}
              to={`/user/${username}/${slugs[key][0]}`}
              className="user-nav-tabs--link"
              end
            >
              {({ isActive }) => (
                <div
                  className={`user-nav-tabs__tab ${
                    isActive ? "is-active" : ""
                  }`}
                >
                  <div className="user-nav-tabs__label">{slugs[key][1]}</div>
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
        {/* {isThisUser ? (
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
        ) : null} */}
      </div>
    </div>
  );
};
