import { useEffect } from "react";

import { json, redirect } from "@remix-run/node";
import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { useActionData, useFetcher, useSearchParams } from "@remix-run/react";
import { parseFormAny } from "react-zorm";
import { z } from "zod";

import { supabaseClient } from "~/integrations/supabase";
import {
  refreshAccessToken,
  commitAuthSession,
  getAuthSession,
} from "~/modules/auth";
import { tryCreateUser, getUserByEmail } from "~/modules/user";
import { assertIsPost, safeRedirect } from "~/utils";

// imagine a user go back after OAuth login success or type this URL
// we don't want him to fall in a black hole 👽
export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);

  if (authSession) return redirect("/");

  return json({});
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);

  const formData = await request.formData();
  const result = await z
    .object({
      refreshToken: z.string(),
      redirectTo: z.string().optional(),
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

  const { redirectTo, refreshToken } = result.data;
  const safeRedirectTo = safeRedirect(redirectTo, "/notes");

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

  // user have an account, skip creation part and just commit session
  if (await getUserByEmail(authSession.email)) {
    return redirect(safeRedirectTo, {
      headers: {
        "Set-Cookie": await commitAuthSession(request, {
          authSession,
        }),
      },
    });
  }

  // first time sign in, let's create a brand-new User row in supabase

  return redirect("/complete-profile", {
    headers: {
      "Set-Cookie": await commitAuthSession(request, {
        authSession,
      }),
    },
  });
}

export default function LoginCallback() {
  const error = useActionData<typeof action>();
  const fetcher = useFetcher();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  useEffect(() => {
    const parsedHash = new URLSearchParams(location.hash.substring(1));
    const refreshToken = parsedHash.get("refresh_token");
    if (refreshToken) {
      const formData = new FormData();
      formData.append("refreshToken", refreshToken);
      formData.append("redirectTo", redirectTo);
      fetcher.submit(formData, { method: "post", replace: true });
    }
  }, [location, redirectTo]);

  return error ? <div>{error.message}</div> : null;
}
