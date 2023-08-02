import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { json } from "@remix-run/router";
import { sanitize } from "isomorphic-dompurify";
import { z } from "zod";

import { checkIfUserBanned } from "~/components/ModTools/logic/checkIfUserBanned";
import CreatePost from "~/components/Post/CreatePost";
import { db } from "~/database/db.server";
import { formDataToObject } from "~/logic/formDataToObject";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import createPostStyles from "~/styles/createpost.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(createPostStyles);

export const loader: LoaderFunction = async ({ request, params }) => {
  const authSession = await getAuthSession(request);
  console.log({ authSession });
  if (!authSession) {
    return redirect(`/community/${params.route}`);
  }
  const isUserBanned = await checkIfUserBanned(
    authSession.userId,
    params.route || "",
  );
  if (isUserBanned) {
    throw json(
      { message: isUserBanned, errorType: "user-is-banned-from-community" },
      { status: 403 },
    );
  }
  return null;
};

const payloadSchema = z.object({
  authorId: z.string(),
  communityRoute: z.string(),
  title: z.string(),
  link: z.union([z.null(), z.literal(""), z.string().trim().url()]).optional(),
  text: z.union([z.null(), z.literal(""), z.string().trim()]).optional(),
});
export const action: ActionFunction = async ({ request, params }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });
  const { userId } = authSession;

  const data = await request.formData().then(formDataToObject);

  const payload = {
    authorId: userId,
    communityRoute: params.route,
    title: data["post-title"],
    link: data["post-link"] ?? null,
    text: data["post-text"] ? sanitize(data["post-text"]) : null,
  };
  if (!payload.link && !payload.text) {
    throw new Error(`Post contains no link, no text, and no embedded image`);
  }
  try {
    const postData = await db.post.create({
      data: payloadSchema.parse(payload),
    });
    return redirect(
      `/community/${postData.communityRoute}/post/${postData.id}`,
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
