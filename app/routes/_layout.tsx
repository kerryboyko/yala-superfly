import type { LoaderFunction, TypedResponse } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { GenericErrorBoundary } from "~/components/Error/GenericErrorBoundary";
import Footer from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { db } from "~/database/db.server";
import { getAuthSession } from "~/modules/auth";
import footerStyles from "~/styles/footer.css";
import headerStyles from "~/styles/header.css";
import indexStyles from "~/styles/index.css";
import { linkFunctionFactory } from "~/utils/linkFunctionFactory";

export const links = linkFunctionFactory(
  headerStyles,
  indexStyles,
  footerStyles,
);

export const loader: LoaderFunction = async ({
  request,
}): Promise<
  TypedResponse<{
    isLoggedIn: boolean;
    user?: { username: string };
    message?: string;
  }>
> => {
  const authSession = await getAuthSession(request);
  if (!authSession) {
    return json({ isLoggedIn: false, username: undefined });
  }

  const { userId } = authSession;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return json({ isLoggedIn: false });
  }

  const profile = await db.profile.findUnique({
    where: { userId },
    select: { username: true, verified: true },
  });

  if (!profile) {
    return redirect("/complete-profile");
  }

  return json({ isLoggedIn: true, username: profile.username });
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="full-layout">
      <div>
        <header>
          <Header isLoggedIn={data.isLoggedIn} username={data.username} />
        </header>
        <main>
          <div className="outlet-main">
            <Outlet />
          </div>
        </main>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export const ErrorBoundary = (props: any) => (
  <GenericErrorBoundary {...props} />
);
