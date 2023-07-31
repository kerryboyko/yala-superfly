import type { ActionArgs } from "@remix-run/node";
import { fetch } from "@remix-run/node";

export const action = async ({ params }: ActionArgs) => {
  const { deleteHash } = params;
  if (process.env.IMGUR_ACCESS_UPLOAD_URL && deleteHash) {
    try {
      await fetch(
        `${process.env.IMGUR_ACCESS_UPLOAD_URL}/${deleteHash}` || "",
        {
          headers: {
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
          method: "delete",
        },
      );
      return null;
    } catch (err) {
      throw new Error(`Something went wrong: ${err}`);
    }
  }

  throw new Error(`Something went wrong`);
};
