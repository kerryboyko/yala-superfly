import { ActionFunction, json, redirect } from "@remix-run/node";
import { db } from "~/database";
import { requireAuthSession } from "~/modules/auth";

export const action: ActionFunction = async ({ request }) => {
  const authUser = await requireAuthSession(request, {
    verify: true,
    onFailRedirectTo: "/login",
  });
  const formData = await request.formData();
  const communityRoute = formData.get("communityRoute") as string;
  const postId = formData.get("postId") as string;

  const postWhere = {
    id: parseInt(postId, 10),
    communityRoute: communityRoute,
  };

  const post = await db.post.findFirstOrThrow({
    where: postWhere,
    select: {
      authorId: true,
      community: {
        select: {
          moderators: {
            select: {
              moderatorId: true,
            },
          },
        },
      },
    },
  });
  if (
    ![
      post.authorId,
      ...post.community.moderators.map((m) => m.moderatorId),
    ].includes(authUser.userId)
  ) {
    throw redirect("/");
  }
  const deletion = await db.post.delete({
    where: postWhere,
  });
  return json({ ...deletion });
};
