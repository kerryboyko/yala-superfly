import { useEffect } from "react";

import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { useActionData, useFetcher, useLocation } from "@remix-run/react";
import pick from "lodash/pick";
import { parseFormAny } from "react-zorm";
import { z } from "zod";

import {
  refreshAccessToken,
  commitAuthSession,
  getAuthSession,
} from "~/modules/auth";
import {
  getUserByEmailAndCheckUsername,
  tryCreateUserWithoutUsername,
} from "~/modules/user";
import { assertIsPost } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  // If the user is already authenticated,
  // we'll redirect them to create profile - and we'll check if the
  // profile is complete there. If it is, we'll just re-redirect them to ('/');
  if (authSession) {
    return redirect("/create-profile");
  }

  return null;
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);

  const formData = await request.formData();
  // always a string or undefined, not a boolean
  const redirectToJoin = formData.get("redirectToJoin");
  // user has gotten to this page somehow without a token. Just redirect them to /join.
  if (redirectToJoin === "true") {
    return redirect("/join");
  }

  const result = await z
    .object({
      refreshToken: z.string(),
    })
    .safeParseAsync(parseFormAny(formData));

  if (!result.success) {
    return json(
      {
        message: "invalid-request",
      },
      { status: 400 },
    );
  }

  const { refreshToken } = result.data;

  // We should not trust what is sent from the client
  // https://github.com/rphlmr/supa-fly-stack/issues/45
  const authSession = await refreshAccessToken(refreshToken);
  if (!authSession) {
    return json(
      {
        message: "invalid-refresh-token",
      },
      { status: 401 },
    );
  }

  // we'll use this in a bit.
  const redirectAndCommit = async (redirectTo: string) =>
    redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitAuthSession(request, {
          authSession,
        }),
      },
    });

  const user = await getUserByEmailAndCheckUsername(authSession.email);
  const username = user?.profile?.username;

  // user is authenticated, has an account, and has a username.
  // skip creation part and just commit session
  if (!!user && !!username) {
    return redirectAndCommit("/");
  }

  // user is authenticated and has an account, but does NOT have a username.
  // Skip Creation, but send to complete-profile.
  if (!!user && !username) {
    return redirectAndCommit("/complete-profile");
  }
  // user is authenticated but does not have an account
  // Create an account.

  const newUser = await tryCreateUserWithoutUsername(
    pick(authSession, ["userId", "email"]),
  );
  // Account creation fails
  if (!newUser) {
    return json(
      {
        ok: false,
        message: `We tried to create a new user in our database, but a user with this e-mail aready exists. We've signed you out - perhaps you've logged in with this e-mail through another service?`,
      },
      { status: 500 },
    );
  }
  // Account creation succeeds, but we still need to check to see if they
  // need to create a profile.
  // We will send them to create-profile anyway, and we'll check to see if they have
  // a profile in the loader, and we'll redirect them again there.
  return redirectAndCommit("/complete-profile");
}

export default function LoginCallback() {
  const error = useActionData<typeof action>();
  const fetcher = useFetcher();
  const location = useLocation();

  useEffect(() => {
    const parsedHash = new URLSearchParams(location.hash.substring(1));
    const refreshToken = parsedHash.get("refresh_token");
    const formData = new FormData();
    if (refreshToken) {
      formData.append("refreshToken", refreshToken);
    } else {
      formData.append("redirectToJoin", "true");
    }
    fetcher.submit(formData, { method: "post", replace: true });
  }, [location, fetcher]);

  return error ? <div>{error.message}</div> : null;
}
