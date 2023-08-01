import { db } from "~/database/db.server";

export const checkIfUserBanned = async (userId: string, route: string) => {
  const ban = await db.communityBan.findFirst({
    where: {
      bannedUserId: userId,
      communityRoute: route,
    },
    select: {
      banReason: true,
      bannedBy: {
        select: {
          username: true,
        },
      },
    },
  });
  if (!ban) {
    return null;
  }
  return [
    `You have been banned from posting or commenting on /c/${route} by ${ban.bannedBy.username}.`,
  ]
    .concat(
      ban.banReason
        ? `The reason listed is: ${ban.banReason}`
        : `No reason was listed`,
    )
    .join("\n");
};
