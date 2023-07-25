import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useSearchParams, useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { i18nextServer } from "~/integrations/i18n";
import { createAuthSession, getAuthSession } from "~/modules/auth";
import { assertIsPost, isFormProcessing } from "~/utils";
import { signInWithEmailOrUsername } from "~/modules/auth/service.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import authStyles from "~/styles/auth.css";

export const links: LinksFunction = () =>
  [authStyles].map((href) => ({ rel: "stylesheet", href }));

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  const t = await i18nextServer.getFixedT(request, "auth");
  const title = t("login.title");

  if (authSession) return redirect("/");

  return json({ title });
}

const LoginFormSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
  redirectTo: z.string().optional(),
});

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const formData = await request.formData();
  const result = await LoginFormSchema.safeParseAsync(parseFormAny(formData));

  if (!result.success) {
    return json(
      {
        errors: result.error,
      },
      { status: 400 },
    );
  }

  const { emailOrUsername, password, redirectTo } = result.data;

  const authSession = await signInWithEmailOrUsername(
    emailOrUsername,
    password,
  );

  if (!authSession) {
    return json(
      { errors: { email: "invalid-email-password", password: null } },
      { status: 400 },
    );
  }

  return createAuthSession({
    request,
    authSession,
    redirectTo: redirectTo || "/",
  });
}

export const meta: V2_MetaFunction = ({ data }) => [
  {
    title: data.title,
  },
];

export default function LoginPage() {
  const zo = useZorm("NewQuestionWizardScreen", LoginFormSchema);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const transition = useTransition();
  const disabled = isFormProcessing(transition.state);
  const { t } = useTranslation("auth");

  return (
    <div className="login">
      <Card className="card login__card">
        <CardHeader>
          <CardTitle>{t("login.action")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form ref={zo.ref} method="post" replace>
            <div className="field field__email">
              <Label htmlFor={zo.fields.emailOrUsername()} className="label">
                {t("login.emailOrUsername")}
              </Label>

              <Input
                data-test-id="email"
                required
                autoFocus={true}
                name={zo.fields.emailOrUsername()}
                type="text"
                autoComplete="email"
                className="input input__email-or-username"
                disabled={disabled}
              />
              {zo.errors.emailOrUsername()?.message ? (
                <div className="error error__email" id="email-error">
                  {zo.errors.emailOrUsername()?.message}
                </div>
              ) : null}
            </div>

            <div className="field field__password">
              <Label htmlFor={zo.fields.password()} className="label">
                {t("login.password")}
              </Label>
              <Input
                data-test-id="password"
                name={zo.fields.password()}
                type="password"
                autoComplete="new-password"
                className="input input__password"
                disabled={disabled}
              />
              {zo.errors.password()?.message && (
                <div className="error error__password" id="password-error">
                  {zo.errors.password()?.message}
                </div>
              )}
            </div>

            <input
              type="hidden"
              name={zo.fields.redirectTo()}
              value={redirectTo}
            />
            <Button
              data-test-id="login"
              type="submit"
              className="button login__button"
              disabled={disabled}
            >
              {t("login.action")}
            </Button>
          </Form>
          <hr />
          <div className="forgot-password">
            <Link to="/forgot-password">{t("login.forgotPassword")}?</Link>
          </div>
          <div className="dont-have-account">
            {t("login.dontHaveAccount")}{" "}
            <Link
              to={{
                pathname: "/join",
                search: searchParams.toString(),
              }}
            >
              {t("login.signUp")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
