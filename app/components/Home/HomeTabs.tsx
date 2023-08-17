import { NavLink } from "@remix-run/react";
import {
  ActivitySquare,
  Flame,
  Home,
  MessageCircle,
  Clock,
} from "lucide-react";
import navTabStyles from "~/styles/nav-tabs.css";

export const styles = navTabStyles;

export interface HomeTabsProps {
  isLoggedIn: boolean;
}

export const HomeTabs = ({ isLoggedIn }: HomeTabsProps) => {
  return (
    <div className="nav-tabs">
      <div className="nav-tabs__container">
        {isLoggedIn ? (
          <NavLink key={"home"} to={`/`} className="nav-tabs--link" end>
            {({ isActive }) => (
              <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
                <div className="nav-tabs__label">
                  <Home className="icon" />
                  Home
                </div>
              </div>
            )}
          </NavLink>
        ) : null}
        <NavLink
          key={"hottest-posts"}
          to={isLoggedIn ? `/hottest` : "/"}
          className="nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
              <div className="nav-tabs__label">
                <Flame className="icon" />
                Hottest Posts
              </div>
            </div>
          )}
        </NavLink>
        <NavLink
          key={"newest-posts"}
          to={`/newest`}
          className="nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
              <div className="nav-tabs__label">
                <Clock className="icon" />
                Newest Posts
              </div>
            </div>
          )}
        </NavLink>
        <NavLink
          key={"most-popular-communities"}
          to={`/popular-communities`}
          className="nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
              <div className="nav-tabs__label">
                <MessageCircle className="icon" />
                Popular Communities
              </div>
            </div>
          )}
        </NavLink>
        <NavLink
          key={"most-active-communities"}
          to={`/active-communities`}
          className="nav-tabs--link"
          end
        >
          {({ isActive }) => (
            <div className={`nav-tabs__tab ${isActive ? "is-active" : ""}`}>
              <div className="nav-tabs__label">
                <ActivitySquare className="icon" />
                Active Communities
              </div>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};
