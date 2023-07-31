import { db } from "~/database";
import { getSupabaseAdmin } from "~/integrations/supabase";
import { SERVER_URL } from "~/utils/env";
import { stringIsEmail } from "~/utils/stringIsEmail";

import { mapAuthSession } from "./mappers";
import type { AuthSession } from "./types";

export async function createEmailAuthAccount(email: string, password: string) {
  const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true, // FIXME: demo purpose, assert that email is confirmed. For production, check email confirmation
  });

  if (!data.user || error) return null;

  return data.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await getSupabaseAdmin().auth.signInWithPassword({
    email,
    password,
  });

  if (!data.session || error) return null;

  return mapAuthSession(data.session);
}

export async function signInWithEmailOrUsername(
  emailOrUsername: string,
  password: string,
) {
  if (stringIsEmail(emailOrUsername)) {
    return signInWithEmail(emailOrUsername, password);
  }
  try {
    const { userId } = await db.profile.findUniqueOrThrow({
      where: { username: emailOrUsername },
      select: { userId: true },
    });
    const { email } = await db.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true },
    });
    return signInWithEmail(email, password);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function sendMagicLink(email: string) {
  return getSupabaseAdmin().auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${SERVER_URL}/oauth/callback`,
    },
  });
}

export async function sendResetPasswordLink(email: string) {
  return getSupabaseAdmin().auth.resetPasswordForEmail(email, {
    redirectTo: `${SERVER_URL}/reset-password`,
  });
}

export async function updateAccountPassword(id: string, password: string) {
  const { data, error } = await getSupabaseAdmin().auth.admin.updateUserById(
    id,
    { password },
  );

  if (!data.user || error) return null;

  return data.user;
}

export async function deleteAuthAccount(userId: string) {
  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(userId);

  if (error) return null;

  return true;
}

export async function getAuthAccountByAccessToken(accessToken: string) {
  const { data, error } = await getSupabaseAdmin().auth.getUser(accessToken);

  if (!data.user || error) return null;

  return data.user;
}

export async function refreshAccessToken(
  refreshToken?: string,
): Promise<AuthSession | null> {
  if (!refreshToken) return null;

  const { data, error } = await getSupabaseAdmin().auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (!data.session || error) return null;

  return mapAuthSession(data.session);
}
