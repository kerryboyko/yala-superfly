import { Link, NavLink } from "@remix-run/react";
import { PlusCircle } from "lucide-react";

import { AuthButtons } from "~/components/AuthButtons/AuthButtons";
import { Badge } from "~/components/ui/badge";

export const Header = ({
  isLoggedIn,
  username,
}: {
  isLoggedIn: boolean;
  username: string | undefined;
}) => (
  <div className="header">
    <div className="header__main">
      <div className="header__site-name">
        <Link to="/">YALA: Yet Another Link Aggregator</Link>
      </div>

      <AuthButtons isLoggedIn={isLoggedIn} />
    </div>
    {isLoggedIn ? (
      <div className="header__interaction-bar">
        <div>
          {isLoggedIn ? (
            <span>
              Welcome back, <Link to={`/user/${username}`}>{username}</Link>!
            </span>
          ) : null}
        </div>

        <div>
          <NavLink to="/create-community">
            {({ isActive }) =>
              isActive ? null : (
                <Badge className="command-icon__badge">
                  <PlusCircle size="1rem" />
                  <div className="command-icon__badge__text">
                    Create New Community
                  </div>
                </Badge>
              )
            }
          </NavLink>
        </div>
      </div>
    ) : null}
    <div className="header__link-navigation">
      <NavLink className="header__link-navigation--link" to="/about">
        About The YALA Project
      </NavLink>
      <NavLink className="header__link-navigation--link" to="/c/yaladev">
        /c/yaladev - dev community
      </NavLink>
      <NavLink className="header__link-navigation--link" to="/allposts">
        All Posts
      </NavLink>
      <NavLink className="header__link-navigation--link" to="/allcommunities">
        All Communities
      </NavLink>
    </div>
  </div>
);
