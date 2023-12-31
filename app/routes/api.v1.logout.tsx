import type { ActionArgs } from "@remix-run/node";

import { destroyAuthSession } from "~/modules/auth";
import { assertIsPost } from "~/utils";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);

  return await destroyAuthSession(request);
}

export async function loader({ request }: ActionArgs) {
  return await destroyAuthSession(request);
}
