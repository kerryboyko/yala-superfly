import { redirect, json } from "@remix-run/node";
import { Form, Link, useSearchParams, useTransition } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { i18nextServer } from "~/integrations/i18n";
import {
  createAuthSession,
  getAuthSession,
  ContinueWithEmailForm,
} from "~/modules/auth";
import {
  getUserByEmail,
  createUserAccount,
  getUserByUsername,
} from "~/modules/user";
import { assertIsPost, isFormProcessing } from "~/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import authStyles from "~/styles/auth.css";

export const links: LinksFunction = () =>
  [authStyles].map((href) => ({ rel: "stylesheet", href }));

import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  MetaFunction,
  V2_MetaFunction,
} from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  const t = await i18nextServer.getFixedT(request, "auth");
  const title = t("register.title");

  if (authSession) return redirect("/");

  return json({ title });
}

const JoinFormSchema = z.object({
  email: z
    .string()
    .email("invalid-email")
    .transform((email) => email.toLowerCase()),
  username: z.string().min(4, "username-too-short"),
  password: z.string().min(8, "password-too-short"),
  redirectTo: z.string().optional(),
});

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const formData = await request.formData();
  const result = await JoinFormSchema.safeParseAsync(parseFormAny(formData));
  console.log({ result });
  if (!result.success) {
    return json(
      {
        errors: result.error,
      },
      { status: 400 },
    );
  }

  const { email, password, username, redirectTo } = result.data;

  const existingEmail = await getUserByEmail(email);

  if (existingEmail) {
    return json(
      { errors: { email: "user-already-exist", password: null } },
      { status: 400 },
    );
  }

  const existingUsername = await getUserByUsername(username);

  if (existingEmail) {
    return json(
      { errors: { email: "user-already-exist", password: null } },
      { status: 400 },
    );
  }

  const authSession = await createUserAccount(email, password, username);

  if (!authSession) {
    return json(
      { errors: { email: "unable-to-create-account", password: null } },
      { status: 500 },
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

export default function Join() {
  const zo = useZorm("NewQuestionWizardScreen", JoinFormSchema);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const transition = useTransition();
  const disabled = isFormProcessing(transition.state);
  const { t } = useTranslation("auth");

  return (
    <div className="sign-up">
      <Card className="sign-up__card">
        <CardHeader>
          <CardTitle>{t("register.createNewAccount")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form ref={zo.ref} method="post" replace>
            <div className="field field__username">
              <Label
                className="label label__username"
                htmlFor={zo.fields.username()}
              >
                {t("register.username")}
              </Label>
              <Input
                className="input input__username"
                data-test-id="username"
                required
                autoFocus={true}
                name={zo.fields.username()}
                type="text"
                autoComplete="username"
                placeholder="Username"
                disabled={disabled}
              />
              {zo.errors.username()?.message && (
                <div className="error error__username" id="username-error">
                  {zo.errors.username()?.message}
                </div>
              )}
            </div>
            <div className="field field__email">
              <Label className="label" htmlFor={zo.fields.email()}>
                {t("register.email")}
              </Label>
              <Input
                className="input input__email"
                data-test-id="email"
                required
                autoFocus={true}
                name={zo.fields.email()}
                type="email"
                autoComplete="email"
                placeholder="email@domain.com"
                disabled={disabled}
              />
              {zo.errors.email()?.message && (
                <div className="error error__email" id="email-error">
                  {zo.errors.email()?.message}
                </div>
              )}
            </div>

            <div className="field field__password">
              <Label
                className="label label__password"
                htmlFor={zo.fields.password()}
              >
                {t("register.password")}
              </Label>
              <Input
                className="input input__password"
                data-test-id="password"
                name={zo.fields.password()}
                type="password"
                autoComplete="new-password"
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
              data-test-id="create-account"
              className="button create-account__button"
              type="submit"
              disabled={disabled}
            >
              {t("register.action")}
            </Button>
            <div className="create-account__already-have-account">
              {t("register.alreadyHaveAnAccount")}{" "}
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                {t("register.login")}
              </Link>
            </div>
          </Form>
        </CardContent>
        {/* <div>
          <span>{t("register.orContinueWith")}</span>
          <div>
            <ContinueWithEmailForm />
          </div>
        </div> */}
      </Card>
    </div>
  );
}
