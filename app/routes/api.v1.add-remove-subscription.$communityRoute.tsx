import { json, type ActionArgs } from "@remix-run/node";
import { db } from "~/database";
import { formDataToObject } from "~/logic/formDataToObject";
import { requireAuthSession } from "~/modules/auth";

export const action = async ({ request, params }: ActionArgs) => {
  console.log(params);
  const authUser = await requireAuthSession(request, {
    verify: true,
    onFailRedirectTo: "/login",
  });
  const { userId } = authUser;
  const formData = await request.formData();
  const shouldSubscribe = formData.get("setSubscribe") === "true";
  const communityExists = await db.community.findUnique({
    where: {
      route: params.communityRoute,
    },
  });
  if (!communityExists) {
    throw json({
      status: 404,
      ok: false,
      message: `No community with name ${params.communityRoute} exists`,
    });
  }

  const existingSubscription = await db.communitySubscribers.findFirst({
    where: {
      subscriberId: userId,
      communityRoute: params.communityRoute,
    },
    select: {
      id: true,
    },
  });

  if (shouldSubscribe && existingSubscription) {
    return json({
      status: 200,
      ok: true,
      message: "User is already subscribed",
    });
  }
  if (!shouldSubscribe && !existingSubscription) {
    return json({
      status: 200,
      ok: true,
      message: "User does not have this subscription",
    });
  }
  if (shouldSubscribe) {
    const result = await db.communitySubscribers.create({
      data: {
        communityRoute: params.communityRoute!,
        subscriberId: userId,
      },
    });
    return json({ status: 201, ok: true, result });
  }
  if (shouldSubscribe) {
    const result = await db.communitySubscribers.create({
      data: {
        communityRoute: params.communityRoute!,
        subscriberId: userId,
      },
    });
    return json({ status: 201, ok: true, outcome: "created", created: result });
  }
  const result = await db.communitySubscribers.delete({
    where: {
      id: existingSubscription!.id,
    },
  });
  return json({ status: 201, ok: true, outcome: "deleted", deleted: result });
};
