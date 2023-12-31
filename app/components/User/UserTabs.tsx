import { NavLink } from "@remix-run/react";

import navTabStyles from "~/styles/nav-tabs.css";

export const styles = navTabStyles;
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
    <div className="nav-tabs">
      <div className="nav-tabs__container">
        <NavLink
          key={"overview"}
          to={`/user/${username}`}
          className="nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
              <div className="nav-tabs__label">Overview</div>
            </div>
          )}
        </NavLink>
        {["posts", "comments", "subscribes", "moderates"]
          .filter((key) => Object.keys(slugs).includes(key))
          .map((key: string) => (
            <NavLink
              key={key}
              to={`/user/${username}/${slugs[key][0]}`}
              className="nav-tabs--link"
              end
            >
              {({ isActive }) => (
                <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
                  <div className="nav-tabs__label">{slugs[key][1]}</div>
                  {profile._count[key] > 0 ? (
                    <div
                      className={`nav-tabs__count ${
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
            className="nav-tabs--link"
            end
          >
            {({ isActive }) => (
              <div
                className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}
              >
                <div className="nav-tabs__label">Messages</div>
              </div>
            )}
          </NavLink>
        ) : null} */}
      </div>
    </div>
  );
};
