import { Form } from "@remix-run/react";

import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import CreatePost from "~/components/Post/CreatePost";
import createPostStyles from "~/styles/createpost.css";
import { requireAuthSession } from "~/modules/auth";

import { formDataToObject } from "~/logic/formDataToObject";
import { sanitize } from "isomorphic-dompurify";
import { z } from "zod";
import { db } from "~/database/db.server";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: createPostStyles },
];

const payloadSchema = z.object({
  authorId: z.string(),
  communityRoute: z.string(),
  title: z.string(),
  link: z.union([z.null(), z.literal(""), z.string().trim().url()]).optional(),
  text: z.union([z.null(), z.literal(""), z.string().trim()]).optional(),
  embeds: z
    .union([z.null(), z.literal(""), z.string().trim().url()])
    .optional(),
});
export const action: ActionFunction = async ({ request, params }) => {
  const authUser = await requireAuthSession(request);
  if (authUser === null) {
    return redirect("/");
  }

  const data = await request.formData().then(formDataToObject);

  const payload = {
    authorId: authUser.extraParams.userId,
    communityRoute: params.route,
    title: data["post-title"],
    link: data["post-link"] ?? null,
    text: data["post-text"] ? sanitize(data["post-text"]) : null,
    embeds: data["image-embed"] ?? null,
  };
  if (!payload.link && !payload.text && !payload.embeds) {
    throw new Error(`Post contains no link, no text, and no embedded image`);
  }
  try {
    const postData = await db.post.create({
      data: payloadSchema.parse(payload),
    });
    return redirect(
      `/dashboard/community/${postData.communityRoute}/post/${postData.id}`,
    );
  } catch (err) {
    console.error(err);
  }

  return null;
};

export default function CreateNewPostRoute() {
  return (
    <div className="create-post__container">
      <Form method="post">
        <CreatePost />
      </Form>
    </div>
  );
}
