import { Profile, User } from "@prisma/client";
import { db } from "~/database";
import type { AuthSession } from "~/modules/auth";
import {
  createEmailAuthAccount,
  signInWithEmail,
  deleteAuthAccount,
} from "~/modules/auth";

export async function getUserByEmail(email: User["email"]) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } });
}

export async function getUserByUsername(username: Profile["username"]) {
  return db.profile.findUnique({ where: { username: username.toLowerCase() } });
}

async function createUser({
  username,
  email,
  userId,
}: Pick<AuthSession, "userId" | "email"> & { username: string }) {
  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        id: userId,
      },
    });
    const profile = await tx.profile.create({
      data: {
        userId,
        username,
        verified: false,
      },
    });
    return { user, profile };
  });
}

export async function tryCreateUser({
  email,
  userId,
  username,
}: Pick<AuthSession, "userId" | "email"> & { username: string }) {
  const { user, profile } = await createUser({
    userId,
    email,
    username,
  });

  // user account created and have a session but unable to store in User table
  // we should delete the user account to allow retry create account again
  if (!user) {
    await deleteAuthAccount(userId);
    return null;
  }

  return { user, profile };
}

export async function createUserAccount(
  email: string,
  password: string,
  username: string,
): Promise<AuthSession | null> {
  const authAccount = await createEmailAuthAccount(email, password);

  // ok, no user account created
  if (!authAccount) return null;

  const authSession = await signInWithEmail(email, password);

  // user account created but no session 😱
  // we should delete the user account to allow retry create account again
  if (!authSession) {
    await deleteAuthAccount(authAccount.id);
    return null;
  }

  const user = await tryCreateUser({ ...authSession, username });

  if (!user) return null;

  return authSession;
}
