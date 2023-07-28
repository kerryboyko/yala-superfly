import type {
  ActionArgs,
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  TypedResponse,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CreateCommunityForm } from "~/components/Community/CreateCommunity";
import { formDataToObject } from "~/logic/formDataToObject";
import { db } from "~/database/db.server";
import { z } from "zod";
import { COMMUNITY_NAME_CHAR_LIMITS } from "~/constants/communityNameLimits";

import createCommunityStyles from "~/styles/createcommunity.css";
import { getAuthSession, requireAuthSession } from "~/modules/auth";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(createCommunityStyles);

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
});

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
  const { userId } = authSession;
  const data = await request.formData().then(formDataToObject);

  try {
    const { communityName, communityDescription, communityRoute } =
      formSchema.parse(data);

    const transactionData = await db.$transaction(async (tx) => {
      const community = await tx.community.create({
        data: {
          name: communityName.toString(),
          description: communityDescription,
          route: communityRoute,
          createdById: userId,
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
