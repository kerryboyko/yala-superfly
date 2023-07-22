import type { ActionArgs } from "@remix-run/node";
import { fetch, json } from "@remix-run/node";
import pick from "lodash/pick";
import { convertStream } from "~/logic/convertStream";

export const action = async ({ request }: ActionArgs) => {
  const data: ReadableStream<Uint8Array> | null = request.body;
  if (data === null) {
    throw new Error(`Data is not readable`);
  }
  const converted = await convertStream(data);

  const response = await fetch(process.env.IMGUR_ACCESS_UPLOAD_URL || "", {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
    method: "POST",
    body: converted,
  });
  const jsonResponse = await response.json();
  return json(
    pick(jsonResponse.data, [
      "id",
      "width",
      "height",
      "size",
      "deletehash",
      "link",
    ]),
  );
};
