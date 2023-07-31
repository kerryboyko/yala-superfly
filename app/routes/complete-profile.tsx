import { redirect, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { createCustomIssues, useZorm } from "react-zorm";
import { z } from "zod";
import { i18nextServer } from "~/integrations/i18n";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import { getProfileByUsername } from "~/modules/user";
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
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { db } from "~/database";
import { ChangeEventHandler, useState } from "react";
import authStyles from "~/styles/auth.css";

const SPEC_CHAR_REGEX = /^[^`~!@#$%^&*()+={}\[\]|\\:;“’<,>.?๐฿\s]*$/; // negated special characters - underscore is allowed, dashes allowed, spaces are not.
const checkInvalidUsername = (u: string) => !SPEC_CHAR_REGEX.test(u);

export const links = linkFunctionFactory(authStyles);

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  // if no auth session, they need to join first.
  if (!authSession) {
    return redirect("/join");
  }

  const isProfileComplete = await db.profile.findUnique({
    where: {
      userId: authSession?.userId,
    },
    select: {
      username: true,
    },
  });
  // if the profile is complete, skip this step, go straight to the homepage.
  if (isProfileComplete && !!isProfileComplete.username) {
    return redirect("/");
  }

  const t = await i18nextServer.getFixedT(request, "auth");
  const title = t("register.completeProfile");

  return json({ title, authSession });
}

const CompleteProfileSchema = z.object({
  username: z
    .string()
    .min(4, "Usernames must be a minimum of 4 characters")
    .refine(
      (value) => !checkInvalidUsername(value),
      `Username cannot have special characters or spaces, except underscore ('_') and dash ('-').`,
    ),
});

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const issues = createCustomIssues(CompleteProfileSchema);

  // not logged in? no username for you.
  const authSession = await requireAuthSession(request);
  if (!authSession) {
    return redirect("/join");
  }
  // check if the user exists AND it doesn't have a username.
  const user = await db.user.findUnique({
    where: { id: authSession?.userId },
    select: { id: true, profile: { select: { username: true } } },
  });

  // I don't know what token you're using, but it ain't one of ours!
  if (!user) {
    return redirect("/join");
  }
  // You already HAVE a username.  How did you get here?
  if (user && user?.profile?.username) {
    return redirect("/");
  }

  // okay, we know the user has an account, but doesn't have a username.

  const formPayload = Object.fromEntries(await request.formData());
  const parseResult = CompleteProfileSchema.parse(formPayload);
  const { username } = parseResult;

  const existingUsername = await getProfileByUsername(username);

  if (existingUsername) {
    issues.username(
      "There is already a user with that username. Please choose a different one.",
    );
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 400 });
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      username,
      verified: !(process.env.NODE_ENV === "production"), // FIXME, we want email verification always.
    },
  });
  if (!newProfile) {
    issues.username(`We could not create a profile for some unknown reason.`);
  }

  if (issues.hasIssues()) {
    return json({ ok: false, serverIssues: issues.toArray() }, { status: 500 });
  }

  return redirect("/");
}

export const meta: V2_MetaFunction = ({ data }) => [
  {
    title: data.title,
  },
];

export default function CompeteProfile() {
  const { authSession } = useLoaderData();
  const formResponse = useActionData();
  const zo = useZorm("complete-profile-form", CompleteProfileSchema, {
    customIssues: formResponse?.serverIssues,
  });
  const transition = useTransition();
  const disabledFields = isFormProcessing(transition.state);
  const { t } = useTranslation("auth");
  const [warningField, setWarningField] = useState<string>("");
  const [usernameField, setUsernameField] = useState<string>("");

  const disabledButton = warningField !== "";

  const handleUsernameField: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    if (checkInvalidUsername(value)) {
      setWarningField(
        `Warning: Username cannot have special characters or spaces, except underscore ('_') and dash ('-'). `,
      );
    } else {
      setWarningField("");
    }
    setUsernameField(value);
  };

  return (
    <div className="complete-profile">
      <Card className="complete-profile__card">
        <CardHeader>
          <CardTitle>{t("register.addUsername")}</CardTitle>
          <CardDescription>
            One last thing - when you sign in with Google, Facebook, or another
            authentication provider, we store information about your account,
            using your e-mail address to look up the record. However, since you
            (naturally) don't want that e-mail address exposed to spammers and
            trolls, we ask you to create a username here, which will be used for
            your profile and comments. After you've created a username, you'll
            be redirected to the homepage so you can get started.
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
                onChange={handleUsernameField}
                value={usernameField}
                disabled={disabledFields}
              />
              {zo.errors.username((err) =>
                err.message ? (
                  <div className="error error__username" id="username-error">
                    {err.message}
                  </div>
                ) : null,
              )}
              {warningField === "" ? null : (
                <div className="warning warning__username">{warningField}</div>
              )}
            </div>

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
