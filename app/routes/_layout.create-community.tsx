import crypto from "crypto";

import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { CreateCommunityForm } from "~/components/Community/CreateCommunity";
import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";
import { db } from "~/database/db.server";
import { getUserAuthedSupabaseClient } from "~/integrations/supabase";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import createCommunityStyles from "~/styles/createcommunity.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

const getRandomHex = () => crypto.randomBytes(10).toString("base64url");

export const links = linkFunctionFactory(createCommunityStyles);

const formSchema = zfd.formData({
  communityName: zfd.text(
    z.string().min(3).max(COMMUNITY_NAME_CHAR_LIMITS.communityName),
  ),
  communityDescription: zfd.text(
    z.string().max(COMMUNITY_NAME_CHAR_LIMITS.description).optional(),
  ),
  communityRoute: zfd.text(
    z.string().min(3).max(COMMUNITY_NAME_CHAR_LIMITS.communityName),
  ),
  "input-file-upload": zfd.file(z.instanceof(File).optional()),
});

const uploadHandler = async (
  file: File,
  filename: string,
  accessToken: string,
) => {
  const client = getUserAuthedSupabaseClient(accessToken);
  const { data, error } = await client.storage
    .from("public")
    .upload(`header-images/${filename}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const loader: LoaderFunction = async ({ request }) => {
  const authSession = await getAuthSession(request);
  if (!authSession) {
    return redirect("/login");
  }

  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const authSession = await requireAuthSession(request, {
    onFailRedirectTo: "/login",
    verify: true,
  });
  const { userId, accessToken } = authSession;
  const formData = await request.formData();
  try {
    const data = formSchema.parse(formData);
    const { communityName, communityDescription, communityRoute } = data;
    const headerImage = data["input-file-upload"] || null;
    let headerImageUrl: string | null = null;
    if (headerImage) {
      const uploadResponse = await uploadHandler(
        headerImage,
        `header_${getRandomHex()}.${headerImage?.type.split("/").pop()}`,
        accessToken,
      );
      headerImageUrl = uploadResponse.path;
    }

    const transactionData = await db.$transaction(async (tx) => {
      const community = await tx.community.create({
        data: {
          name: communityName.toString(),
          description: communityDescription,
          route: communityRoute,
          createdById: userId,
          headerImage: headerImageUrl,
        },
      });
      const { route } = community;

      const commMod = await tx.communityModerators.create({
        data: {
          communityRoute: route,
          moderatorId: userId,
        },
      });
      const commSub = await tx.communitySubscribers.create({
        data: {
          communityRoute: route,
          subscriberId: userId,
        },
      });
      return { community, commMod, commSub };
    });
    return redirect(`/community/${transactionData.community.route}`);
  } catch (err: any) {
    let errors: any = {};
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
    // postgres unique constraint errors
    if (err.code === "P2002") {
      const targets: string[] =
        (err && err.meta && (err.meta.target as string[])) ?? [];
      if (targets.includes("name")) {
        errors.communityName = `A community with that name already exists`;
      } else if (targets.includes("route")) {
        errors.communityRoute = `A community with that route name already exists`;
      }
    }
    return json({ status: "error", errors, rawError: err }, { status: 500 });
  }
};

export default function CreateCommunityRoute() {
  const actionData: any = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <div className="create-community__route">
      <Form method="post" encType="multipart/form-data">
        <CreateCommunityForm
          loadingState={navigation.state}
          errors={
            actionData?.status === "error"
              ? (actionData?.errors as Record<string, string>)
              : undefined
          }
        />
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      There was an error loading this page.. Sorry.
    </div>
  );
}
