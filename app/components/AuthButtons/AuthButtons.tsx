import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export interface AuthButtonsProps {
  isLoggedIn: boolean;
}

export const AuthButtons = ({ isLoggedIn }: AuthButtonsProps) => {
  console.log({ isLoggedIn });
  if (isLoggedIn) {
    return (
      <div className="login-buttons">
        <Form method="post" action="/api/v1/logout">
          <Button className="button logout" type="submit">
            Logout
          </Button>
        </Form>
      </div>
    );
  }
  return (
    <div className="login-buttons">
      <div>
        <Link to="/join">
          <Button className="button logout" type="button">
            Sign Up
          </Button>
        </Link>
      </div>
      <div>
        <Link to="/login">
          <Button className="button logout" type="button">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};
