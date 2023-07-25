import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/database/db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const idNumber = parseInt(params.postId || "", 10);
  if (isNaN(idNumber)) {
    throw new Response(`Not Found. ${params.postId} is Not a Number`, {
      status: 404,
    });
  }
  const post = await db.post.findUnique({
    where: { id: idNumber },
    select: { community: { select: { route: true } } },
  });
  if (!post) {
    throw new Response(`Not Found. ${params.postId} is not in our records`, {
      status: 404,
    });
  }
  return redirect(`/community/${post.community.route}/post/${idNumber}`);
};
