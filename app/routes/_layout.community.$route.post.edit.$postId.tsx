import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { Navigation } from "lucide-react";
import { z } from "zod";
import { zfd } from "zod-form-data";

import EditPost, { styles as editPostStyles } from "~/components/Post/EditPost";
import { styles as postDetailsStyles } from "~/components/Post/PostDetails";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(postDetailsStyles, editPostStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const { route, postId } = params;
  const authUser = await requireAuthSession(request);
  const post = await db.post.findUnique({
    where: {
      id: parseInt(postId as string, 10),
      communityRoute: route,
      authorId: authUser?.userId,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      title: true,
      text: true,
      link: true,
      embeds: true,
      meta: true,
      community: { select: { name: true, route: true } },
      authorId: true, // will use to match against uuid from token
      author: { select: { username: true } },
    },
  });
  if (!post) {
    throw redirect(`/community/${params.route}/post/${params.postId}`);
  }

  return json(post);
};

const formDataSchema = zfd.formData({
  text: zfd.text(z.string()),
  images: zfd.repeatableOfType(z.string().optional()),
});
const payloadSchema = z.object({
  text: z.string().optional(),
  meta: z.any().optional(),
});
export const action: ActionFunction = async ({ request, params }) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });
  const { route, postId } = params;
  const wherePost = {
    id: Number(postId),
    communityRoute: route || "",
    authorId: authSession?.userId,
  };
  const exists = await db.post.findFirst({
    where: wherePost,
  });
  if (!exists) {
    throw redirect(`/community/${params.route}/post/${params.postId}`);
  }
  const formData = await request.formData();
  const { text, images } = formDataSchema.parse(formData);
  const payload = payloadSchema.parse({
    text,
    meta: {
      images,
    },
  });
  await db.post.update({
    where: wherePost,
    data: payload,
  });
  return redirect(`/community/${params.route}/post/${params.postId}`);
};

export default function EditPostRoute() {
  const navigation = useNavigation();
  const data = useLoaderData<typeof loader>();
  return (
    <Form method="post">
      <EditPost
        postId={data.id}
        communityRoute={data.community.route}
        initialText={data.text || ""}
        postTitle={data.title}
        postLink={data.link}
        loadingState={navigation.state}
        {...data}
      />
    </Form>
  );
}

export function ErrorBoundary() {
  const { username } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">Huh? Who the heck is "{username}"?</div>
    );
  }
  console.error(error);
  return <div className="error-container">Error!</div>;
}
