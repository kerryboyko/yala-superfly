import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";

export interface AuthButtonsProps {
  isLoggedIn: boolean;
}

export const AuthButtons = ({ isLoggedIn }: AuthButtonsProps) => {
  if (isLoggedIn) {
    return (
      <div className="login-buttons">
        <Form method="post" action="/api/v1/logout">
          <Button
            className="login-buttons__buttons__logout--button button"
            variant={"destructive"}
            type="submit"
          >
            Logout
          </Button>
        </Form>
      </div>
    );
  }
  return (
    <div className="login-buttons">
      <div className="login-buttons__buttons__sign-up">
        <Link className="login-buttons__buttons__sign-up--link" to="/join">
          <Button
            className="login-buttons__buttons__sign-up--button button"
            type="button"
          >
            Sign Up
          </Button>
        </Link>
      </div>
      <div className="login-buttons__buttons__login">
        <Link className="login-buttons__buttons__login--link" to="/login">
          <Button
            className="login-buttons__buttons__login--button button"
            type="button"
          >
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};
