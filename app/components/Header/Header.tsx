import { Link, NavLink } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { AuthButtons } from "~/components/AuthButtons/AuthButtons";

export const Header = ({
  isLoggedIn,
  username,
}: {
  isLoggedIn: boolean;
  username: string | undefined;
}) => {
  return (
    <div className="header">
      <div className="header__main">
        <div className="header__site-name">
          YALA: Yet Another Link Aggregator
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
    </div>
  );
};
