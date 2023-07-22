import type { ActionArgs, LinksFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CreateCommunityForm } from "~/components/Community/CreateCommunity";
import { formDataToObject } from "~/logic/formDataToObject";
import { db } from "~/database/db.server";
import { z } from "zod";
import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";

import createCommunityStyles from "~/styles/createcommunity.css";

const formSchema = z.object({
  communityName: z
    .string()
    .min(3)
    .max(COMMUNITY_NAME_CHAR_LIMITS.communityName),
  communityDescription: z
    .string()
    .max(COMMUNITY_NAME_CHAR_LIMITS.description)
    .optional(),
  communityRoute: z
    .string()
    .min(3)
    .max(COMMUNITY_NAME_CHAR_LIMITS.communityName),
  headerImage: z.string().optional(),
});
export const links: LinksFunction = () =>
  [createCommunityStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader = async ({ request }: LoaderArgs) => {
  const authUser = await requireAuthSession(request);
  if (authUser === null) {
    return redirect("/");
  }
  return null;
};

export const action = async ({ request }: ActionArgs) => {
  const authUser = await requireAuthSession(request);
  if (authUser === null) {
    return redirect("/");
  }
  const userId = authUser.extraParams.userId;
  const data = await request.formData().then(formDataToObject);
  try {
    const { communityName, communityDescription, communityRoute, headerImage } =
      formSchema.parse(data);

    const transactionData = await db.$transaction(async (tx) => {
      const community = await tx.community.create({
        data: {
          name: communityName.toString(),
          description: communityDescription,
          route: communityRoute,
          createdById: userId,
          headerImage,
        },
      });
      const { route } = community;

      const commMod = await tx.communityModerators.create({
        data: {
          communityRoute: route,
          userId,
        },
      });
      const commSub = await tx.communitySubscribers.create({
        data: {
          communityRoute: route,
          userId,
        },
      });
      return { community, commMod, commSub };
    });
    return redirect(`/dashboard/community/${transactionData.community.route}`);
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
        errors.communityName = `A community with the name ${data.communityName} already exists`;
      } else if (targets.includes("route")) {
        errors.communityRoute = `A community with the route name of ${data.communityRoute} already exists`;
      }
    }
    return json({ status: "error", errors });
  }
};

export default function CreateCommunityRoute() {
  const actionData: any = useActionData<typeof action>();

  return (
    <div className="create-community__route">
      <Form method="post">
        <CreateCommunityForm
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
