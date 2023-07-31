import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader = ({ params }: LoaderArgs) =>
  redirect(`/community/${params.communityRoute}`);
