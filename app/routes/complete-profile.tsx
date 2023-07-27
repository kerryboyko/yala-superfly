import { redirect, json } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
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
} from "~/modules/user";
import { assertIsPost, isFormProcessing } from "~/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
  V2_MetaFunction,
} from "@remix-run/node";

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
  const authSession = await getAuthSession(request);
  if (!authSession) {
    return redirect("/join");
  }

  const { userId } = authSession;

  const formData = await request.formData();
  const result = await CompleteProfileSchema.safeParseAsync(
    parseFormAny(formData),
  );

  const issues = createCustomIssues(CompleteProfileSchema);

  if (!result.success) {
    return json(
      {
        errors: result.error,
      },
      { status: 400 },
    );
  }

  const { username, redirectTo } = result.data;

  const existingUsername = await getProfileByUsername(username);

  if (existingUsername) {
    issues.username("There is already a user with that username");
  }

  if (issues.hasIssues()) {
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
  }

  updateProfileUsername({
    userId,
    username,
  });

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
