import { NavLink } from "@remix-run/react";
import MarkdownDisplay from "../Markdown/MarkdownDisplay";

export interface UserTabsProps {
  username: string;
}

const TABS: [string | null, string][] = [
  [null, "Overview"],
  ["posts", "Posts"],
  ["comments", "Comments"],
  ["subscriptions", "Subscriptions"],
  ["moderation", "Moderation"],
];

export const UserTabs = ({ username }: UserTabsProps) => {
  return (
    <div className="user-nav-tabs-container">
      <div className="user-nav-tabs">
        {TABS.map(([value, text]) => (
          <NavLink
            key={value}
            to={`/user/${username}${value !== null ? "/" + value : ""}`}
            className="user-nav-link"
            end
          >
            <MarkdownDisplay markdown={text} />
          </NavLink>
        ))}
      </div>
    </div>
  );
};
