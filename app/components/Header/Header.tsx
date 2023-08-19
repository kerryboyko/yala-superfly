import { Link, NavLink } from "@remix-run/react";

import { AuthButtons } from "~/components/AuthButtons/AuthButtons";

export const Header = ({
  isLoggedIn,
  username,
}: {
  isLoggedIn: boolean;
  username: string | undefined;
}) => (
  <div className="header">
    <div className="header__site">
      <Link to="/">
        <img
          className="header__site--logo"
          src="/images/media/waylon-jennings/full-logo-1024.png"
          alt="YALA: Yet Another Link Aggregator"
        />
      </Link>
    </div>
    <div className="header__auth">
      {isLoggedIn ? (
        <div>
          Welcome back, <Link to={`/user/${username}`}>{username}</Link>!
        </div>
      ) : null}
      <AuthButtons isLoggedIn={isLoggedIn} />
    </div>
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
      {isLoggedIn ? (
        <NavLink
          className="header__link-navigation--link"
          to="/create-community"
        >
          {({ isActive }) => (isActive ? null : "Create New Community")}
        </NavLink>
      ) : null}
    </div>
  </div>
);
