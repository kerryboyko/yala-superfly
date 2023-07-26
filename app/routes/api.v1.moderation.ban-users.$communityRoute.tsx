import { ActionFunction, json, redirect } from "@remix-run/node";
import { db } from "~/database";
import { formDataToObject } from "~/logic/formDataToObject";
import { requireAuthSession } from "~/modules/auth";

const isUserNotEligibleForBan = async ({
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
  const bannedUserIsModerator = await db.communityModerators.findFirst({
    where: {
      moderatorId: banProfile.userId,
      communityRoute,
    },
  });
  if (!!bannedUserIsModerator) {
    return {
      ok: false,
      message: "User moderates the community",
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
  const listOfBannedUsers = formData.get("listOfBannedUsers");
  const reason = formData.get("reason");
  if (listOfBannedUsers === null || typeof listOfBannedUsers !== "string") {
    return redirect(`/c/${communityRoute}`);
  }
  const bannedUsers = listOfBannedUsers.split(",").map((u: string) => u.trim());
  const ineligibleUsers = [];
  const eligibleUsers: string[] = [];
  for (const bu of bannedUsers) {
    const result = await isUserNotEligibleForBan({
      username: bu,
      communityRoute,
    });
    if (!result.ok) {
      ineligibleUsers.push([bu, result.message]);
    } else {
      eligibleUsers.push(result.userId);
    }
  }
  if (!eligibleUsers.length) {
    return json({ ineligibleUsers, eligibleUsers });
  }
  const payload = eligibleUsers.map((doomedId: string) => ({
    communityRoute,
    bannedUserId: doomedId,
    bannedById: userId,
    banReason: reason?.toString() || "",
  }));
  const result = await db.communityBan.createMany({
    data: payload,
  });
  return json({
    ineligibleUsers,
    result,
  });
};
