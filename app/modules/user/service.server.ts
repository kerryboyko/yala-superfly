import { Profile, User } from "@prisma/client";
import { redirect } from "@remix-run/node";
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

export async function getUserByEmailAndCheckUsername(email: User["email"]) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { email: true, id: true, profile: { select: { username: true } } },
  });
}

export async function getProfileByUsername(username: Profile["username"]) {
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

export async function tryCreateUserWithoutUsername({
  email,
  userId,
}: Pick<AuthSession, "userId" | "email">) {
  const user = await db.user.create({
    data: {
      email,
      id: userId,
    },
  });
  // user account created and have a session but unable to store in User table
  // we should delete the user account to allow retry create account again
  if (!user) {
    await deleteAuthAccount(userId);
    return null;
  }
  return { user };
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

export async function updateProfileUsername({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  try {
    // ensure userId is already in the DB;
    await db.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = await db.profile.upsert({
      where: { userId },
      update: { username },
      create: { userId, username, verified: false },
    });

    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
}
