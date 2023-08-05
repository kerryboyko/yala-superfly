import { Prisma } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/router";
import { sanitize } from "isomorphic-dompurify";
import { z } from "zod";
import { zfd } from "zod-form-data";

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

const formDataSchema = zfd.formData({
  title: zfd.text(z.string()),
  link: zfd.text(z.string().optional()),
  text: zfd.text(z.string().optional()),
  images: zfd.repeatableOfType(z.string().optional()),
});
const payloadSchema = z.object({
  title: z.string(),
  link: z.string().optional(),
  text: z.string().optional(),
  authorId: z.string(),
  communityRoute: z.string(),
  meta: z.any().optional(),
});
const metaSchema = z.array(z.string()).optional();
export const action: ActionFunction = async ({ request, params }) => {
  // TODO: there has to be a way to make this check without losing the data.
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });
  const { userId } = authSession;

  const { title, link, text, images } = formDataSchema.parse(
    await request.formData(),
  );

  const payload = payloadSchema.parse({
    authorId: userId,
    communityRoute: params.route,
    title,
    link,
    text,
  });
  const imageList = metaSchema.parse(images);
  if (!payload.link && !payload.text) {
    throw new Error(`Post contains no link, no text, and no embedded image`);
  }
  try {
    const postData = await db.post.create({
      data: { ...payload, meta: { images } },
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
  const navigation = useNavigation();
  return (
    <div className="create-post__container">
      <Form method="post">
        <CreatePost loadingState={navigation.state} />
      </Form>
    </div>
  );
}
