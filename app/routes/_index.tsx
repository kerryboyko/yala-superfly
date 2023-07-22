import { LoaderFunction, type LinksFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import aboutStyles from "~/styles/about.css";
import AboutMarkdown from "~/static/markdown/about.md";
import { AuthButtons } from "~/components/AuthButtons/AuthButtons";
import { requireAuthSession } from "~/modules/auth";
import { verifyAuthSessionByRequest } from "~/modules/auth/service.server";

export const links: LinksFunction = () =>
  [aboutStyles].map((href) => ({ rel: "stylesheet", href }));

export const loader: LoaderFunction = async ({ request }) => {
  const authUser = await verifyAuthSessionByRequest(request);
  console.log({ authUser });

  if (!authUser) {
    return json({ isLoggedIn: false, message: "No Authentication" });
  } else {
    return json({ isLoggedIn: true });
  }
};

export default function AboutRoute() {
  const { isLoggedIn } = useLoaderData();
  return (
    <>
      <main>
        <AuthButtons isLoggedIn={isLoggedIn} />
        <div className="about">
          <div className="markdown-display content-box">
            <AboutMarkdown className="markdown-display" />
          </div>
        </div>
      </main>
    </>
  );
}
