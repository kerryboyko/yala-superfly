import { redirect, json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLocation,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, parseFormAny, useZorm } from "react-zorm";
import { z } from "zod";

import { i18nextServer } from "~/integrations/i18n";
import { createAuthSession, getAuthSession } from "~/modules/auth";
import {
  getUserByEmail,
  createUserAccount,
  getProfileByUsername,
  updateProfileUsername,
  tryCreateUser,
} from "~/modules/user";
import { assertIsPost, isFormProcessing } from "~/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/custom/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import authStyles from "~/styles/auth.css";

import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(authStyles);

import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { useEffect, useState } from "react";

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  const t = await i18nextServer.getFixedT(request, "auth");
  const title = t("register.completeProfile");

  if (authSession) return redirect("/");

  return json({ title });
}

const CompleteProfileSchema = z.object({
  username: z.string().min(4, "Usernames must be a minimum of 4 characters"),
  redirectTo: z.string().optional(),
});

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const issues = createCustomIssues(CompleteProfileSchema);

  const authSession = await getAuthSession(request);
  if (!authSession) {
    return redirect("/join");
  }

  const formData = await request.formData();
  const parseResult = CompleteProfileSchema.parse(formData);
  const { username, redirectTo } = parseResult;

  const existingUsername = await getProfileByUsername(username);

  if (existingUsername) {
    issues.username("There is already a user with that username");
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
  }

  const user = await tryCreateUser({ ...authSession, username });

  if (!user) {
    return json({ message: "create-user-error" }, { status: 500 });
  }

  if (issues.hasIssues()) {
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
  }

  return redirect(redirectTo || "/");
}

export const meta: V2_MetaFunction = ({ data }) => [
  {
    title: data.title,
  },
];

export default function CompeteProfile() {
  const formResponse = useActionData();
  const zo = useZorm("complete-profile-form", CompleteProfileSchema, {
    customIssues: formResponse?.serverIssues,
  });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const transition = useTransition();
  const disabledFields = isFormProcessing(transition.state);
  const disabledButton = zo.validation?.success === false;
  const { t } = useTranslation("auth");
  const [userRefreshToken, setUserRefreshToken] = useState<string>("");

  const location = useLocation();

  useEffect(() => {
    const parsedHash = new URLSearchParams(location.hash.substring(1));
    for (let entry in parsedHash.entries()) {
      console.log(entry);
    }
    const refreshToken = parsedHash.get("refresh_token");
    if (refreshToken) {
      setUserRefreshToken(refreshToken);
    }
  }, [location, setUserRefreshToken]);

  return (
    <div className="complete-profile">
      <Card className="complete-profile__card">
        <CardHeader>
          <CardTitle>{t("register.addUsername")}</CardTitle>
          <CardDescription>
            One last thing - when you sign in with Google or another
            authentication provider, we store information about your account,
            using your e-mail address to look up the record. However, since you
            (naturally) don't want that e-mail address exposed to spammers and
            trolls, we ask you to create a username here, which will be used for
            your profile and comments.
          </CardDescription>
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

            <input
              type="hidden"
              name={zo.fields.redirectTo()}
              value={redirectTo}
            />
            <Button
              data-test-id="update-username"
              className="button update-username__button"
              type="submit"
              disabled={disabledButton}
            >
              {t("register.completeProfile")}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
