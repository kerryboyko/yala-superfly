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
import { z } from "zod";
import { zfd } from "zod-form-data";

import EditCommunity from "~/components/Community/EditCommunity";
import headerImageUploadHandler from "~/components/Community/headerImageUploadHandler";
import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";
import { db } from "~/database/db.server";
import { requireAuthSession } from "~/modules/auth";
import createCommunityStyles from "~/styles/createcommunity.css";
import { getRandomB64 } from "~/utils/getRandomString";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(createCommunityStyles);

export const loader = async ({ request, params }: LoaderArgs) => {
  const { route } = params;
  const authUser = await requireAuthSession(request);
  const { userId } = authUser;
  const community = await db.community.findUnique({
    where: {
      route,
    },
    select: {
      moderators: {
        select: {
          moderatorId: true,
        },
      },
      headerImage: true,
      description: true,
    },
  });
  const userIsModerator = community?.moderators?.some(
    ({ moderatorId }) => moderatorId === userId,
  );
  if (!community || !userIsModerator) {
    throw redirect(`/community/${params.route}`);
  }

  return json({ community });
};

const formDataSchema = zfd.formData({
  communityDescription: zfd.text(
    z.string().max(COMMUNITY_NAME_CHAR_LIMITS.description).optional(),
  ),
  "input-file-upload": zfd.file(z.instanceof(File).optional()),
  "delete-original-image": zfd.text(z.coerce.boolean()),
});

export const action: ActionFunction = async ({ request, params }) => {
  const { route } = params;
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });
  const { userId, accessToken } = authSession;

  const moderatorIds = await db.communityModerators.findMany({
    where: { communityRoute: route },
    select: { moderatorId: true },
  });
  if (!moderatorIds.some(({ moderatorId }) => moderatorId === userId)) {
    return json(
      { message: "User is not a moderator of this community" },
      { status: 403 },
    );
  }

  const formData = await request.formData();

  try {
    const data = formDataSchema.parse(formData);
    const { communityDescription } = data;
    const inputFileUpload = data["input-file-upload"] || null;
    const deleteOriginalInstruction = data["delete-original-image"];

    const payload: Record<string, string | null> = {};
    if (communityDescription) {
      payload.description = communityDescription;
    }
    if (inputFileUpload) {
      const uploadResponse = await headerImageUploadHandler(
        inputFileUpload,
        `header_${getRandomB64()}.${inputFileUpload?.type.split("/").pop()}`,
        accessToken,
      );
      payload.headerImage = uploadResponse.path;
    } else if (deleteOriginalInstruction) {
      payload.headerImage = null;
    }

    await db.community.update({
      where: {
        route,
      },
      data: payload,
    });
    return redirect(`/community/${route}`);
  } catch (err: any) {
    let errors: any = {};
    console.error(err);
    // zod validation errors
    if (err.name === "ZodError") {
      for (let issue of err.issues) {
        for (let pathname of issue.path) {
          if (!errors[pathname]) {
            errors[pathname] = "";
          } else {
            errors[pathname] += ", ";
          }
          errors[pathname] += issue.message;
        }
      }
    }
    return json({ status: "error", errors, rawError: err }, { status: 500 });
  }
};

export default function EditCommunityRoute() {
  const navigation = useNavigation();
  const { community } = useLoaderData<typeof loader>();
  return (
    <Form method="post" encType="multipart/form-data">
      <EditCommunity
        initialDescription={community.description || ""}
        initialHeaderImage={community.headerImage || ""}
        loadingState={navigation.state}
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
