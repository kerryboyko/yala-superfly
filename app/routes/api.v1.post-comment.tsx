import type { ActionFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { z } from "zod";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";

const dataSchema = z.object({
  text: z.string(),
  communityRoute: z.string(),
  postId: z.string(),
  parentId: z.union([z.string(), z.null()]).optional(),
});
const payloadSchema = z.object({
  text: z.string(),
  communityRoute: z.string(),
  postId: z.number(),
  parentId: z.union([z.number(), z.null()]).optional(),
  authorId: z.string(),
});
export const action: ActionFunction = async ({ request }) => {
  const authUser = await requireAuthSession(request);
  if (authUser === null) {
    return redirect("/");
  }
  try {
    const data = await request.json();
    dataSchema.parse(data); // check format.
    const payload = payloadSchema.parse({
      ...data,
      postId: parseInt(data.postId, 10),
      parentId:
        data.parentId === null || data.parentId === undefined
          ? null
          : parseInt(data.parentId, 10),
      authorId: authUser.extraParams.userId,
    });
    const dbResponse = await db.comment.create({
      data: {
        ...payload,
      },
    });
    return json(
      { ok: true, data: { ...dbResponse } },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    console.error(err.message);
    return json({ ok: false, message: err?.message }, { status: 500 });
  }
};
