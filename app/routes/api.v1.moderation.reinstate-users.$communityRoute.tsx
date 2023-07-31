import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { db } from "~/database";
import { requireAuthSession } from "~/modules/auth";

const isUserNotEligibleForReinstate = async ({
  username,
  communityRoute,
}: {
  username: string;
  communityRoute: string;
}): Promise<{
  ok: boolean;
  message?: string;
  username: string;
  userId: string;
}> => {
  const banProfile = await db.profile.findUnique({
    where: {
      username,
    },
    select: {
      userId: true,
    },
  });
  if (!banProfile) {
    return { ok: false, message: "User does not exist", username, userId: "" };
  }
  const bannedUserIsActuallyBanned = await db.communityBan.findFirst({
    where: {
      bannedUserId: banProfile.userId,
      communityRoute,
    },
  });
  if (!bannedUserIsActuallyBanned) {
    return {
      ok: false,
      message: "User is not actually banned",
      username,
      userId: banProfile.userId,
    };
  }
  return { ok: true, username, userId: banProfile.userId };
};

export const action: ActionFunction = async ({ request, params }) => {
  const { communityRoute } = params;
  // maybe the community route isn't listed.

  if (!communityRoute) {
    return redirect(`/`);
  }
  const authUser = await requireAuthSession(request, {
    verify: true,
    onFailRedirectTo: "/login",
  });
  const userId = authUser.userId;
  // check if user has the power to ban
  const userIsModerator = await db.communityModerators.findFirst({
    where: {
      communityRoute,
      moderatorId: userId,
    },
  });
  if (!userIsModerator) {
    return redirect(`/c/${communityRoute}`);
  }
  // parse the banned list.
  const formData = await request.formData();
  const userToReinstate = formData.get("userToReinstate");
  if (userToReinstate === null || typeof userToReinstate !== "string") {
    return redirect(`/c/${communityRoute}`);
  }
  const eligibility = await isUserNotEligibleForReinstate({
    username: userToReinstate,
    communityRoute,
  });
  if (eligibility.ok === false) {
    return json(eligibility);
  }
  const result = await db.communityBan.deleteMany({
    where: { communityRoute, bannedUser: { username: userToReinstate } },
  });
  return json({ result });
};
