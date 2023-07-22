import { Form, Link, NavLink } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { PlusCircle } from "lucide-react";

export const Header = ({
  userLoggedIn,
  username,
}: {
  userLoggedIn: boolean;
  username: string | undefined;
}) => {
  return (
    <div className="header">
      <div className="header__main">
        <div className="header__site-name">
          YALA: Yet Another Link Aggregator
        </div>

        {userLoggedIn ? (
          <div className="header__username">
            <Form method="post" action="/api/v1/logout">
              <Button className="button logout" type="submit">
                Logout
              </Button>
            </Form>
            <div className="header__username-display">
              Welcome, <Link to={`/u/${username}`}>{username}</Link>!
            </div>
          </div>
        ) : (
          <Form method="post" action="/api/v1/login">
            <Button name="loginName" className="button login" type="submit">
              Login or Sign Up
            </Button>
          </Form>
        )}
      </div>
      {userLoggedIn ? (
        <div className="header__interaction-bar">
          <div>
            <NavLink to="/dashboard/create-community">
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
