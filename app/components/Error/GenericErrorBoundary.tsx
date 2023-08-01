import get from "lodash/get";
import { useRouteError } from "react-router";
export function GenericErrorBoundary() {
  // const { username } = useParams();
  const error = useRouteError();

  if (get(error, "data.errorType") === "user-is-banned-from-community") {
    return (
      <div>
        {get(
          error,
          "data.message",
          "You have been banned from posting or commenting in this community",
        )}
      </div>
    );
  }

  return <pre>{JSON.stringify(error, null, 2)}</pre>;
}
