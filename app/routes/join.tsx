import { redirect, json } from "@remix-run/node";
import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import {
  SocialLoginButtons,
  styles as socialLoginButtonStyles,
} from "~/components/AuthButtons/SocialLoginButtons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { i18nextServer } from "~/integrations/i18n";
import { createAuthSession, getAuthSession } from "~/modules/auth";
import {
  getUserByEmail,
  createUserAccount,
  getProfileByUsername,
} from "~/modules/user";
import authStyles from "~/styles/auth.css";
import { assertIsPost, isFormProcessing } from "~/utils";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links: LinksFunction = linkFunctionFactory(
  socialLoginButtonStyles,
  authStyles,
);

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  const t = await i18nextServer.getFixedT(request, "auth");
  const title = t("register.title");
  const serverUrl = process.env.SERVER_URL;
  if (authSession) return redirect("/");

  return json({ title, serverUrl });
}

const JoinFormSchema = z.object({
  email: z
    .string()
    .email("Email is invalid")
    .transform((email) => email.toLowerCase()),
  username: z.string().min(4, "Usernames must be a minimum of 4 characters"),
  password: z.string().min(8, "Passwords must be a minimum of 8 characters"),
  redirectTo: z.string().optional(),
});

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const formData = await request.formData();
  const result = await JoinFormSchema.safeParseAsync(parseFormAny(formData));

  const issues = createCustomIssues(JoinFormSchema);

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
    issues.email("There is already a user with that e-mail address");
  }

  const existingUsername = await getProfileByUsername(username);

  if (existingUsername) {
    issues.username("There is already a user with that username");
  }

  if (issues.hasIssues()) {
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
  }

  const authSession = await createUserAccount(email, password, username);
  if (!authSession) {
    issues.email(
      "We're unable to create your account at this time. Please try again later",
    );
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
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
  const { serverUrl } = useLoaderData();
  const formResponse = useActionData();
  const zo = useZorm("sign-up-form", JoinFormSchema, {
    customIssues: formResponse?.serverIssues,
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const transition = useTransition();
  const disabledFields = isFormProcessing(transition.state);
  const disabledButton = zo.validation?.success === false;
  const { t } = useTranslation("auth");

  return (
    <div className="sign-up">
      <Card className="card sign-up__card">
        <CardHeader>
          <CardTitle>{t("register.createNewAccount")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form ref={zo.ref} method="post" replace>
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
                disabled={disabledFields}
              />
              {zo.errors.email((err) =>
                err.message ? (
                  <div className="error error__email" id="email-error">
                    {err.message}
                  </div>
                ) : null,
              )}
            </div>
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
                disabled={disabledFields}
              />
              {zo.errors.username((err) =>
                err.message ? (
                  <div className="error error__username" id="username-error">
                    {err.message}
                  </div>
                ) : null,
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
                disabled={disabledFields}
              />
              {zo.errors.password((err) =>
                err.message ? (
                  <div className="error error__password" id="password-error">
                    {err.message}
                  </div>
                ) : null,
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
              disabled={disabledButton}
            >
              {t("register.action")}
            </Button>
          </Form>
          <hr />
          <div className="already-have-account">
            {t("register.alreadyHaveAnAccount")}{" "}
            <span>
              <Link
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                {t("register.login")}
              </Link>
            </span>
          </div>
        </CardContent>
        <CardContent>
          <SocialLoginButtons serverUrl={serverUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
