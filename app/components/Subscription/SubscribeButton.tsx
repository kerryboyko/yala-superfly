import { useFetcher } from "@remix-run/react";
import { Loader2, MinusCircle, PlusCircle } from "lucide-react";

import subscribeButtonStyles from "~/styles/subscribe-button.css";

import { Button } from "../ui/button";
import { useMemo } from "react";

export const styles = subscribeButtonStyles;

export const SubscribeButton = ({
  communityRoute,
  isSubscribed,
}: {
  communityRoute: string;
  isSubscribed?: boolean;
}) => {
  const fetcher = useFetcher();

  const Icon = useMemo(() => {
    if (fetcher.state === "idle") {
      return isSubscribed ? MinusCircle : PlusCircle;
    }
    return ({ ...props }) => (
      <Loader2 {...props} className={`${props.className ?? ""} loading`} />
    );
  }, [fetcher.state, isSubscribed]);

  return (
    <fetcher.Form
      method="POST"
      action={`/api/v1/add-remove-subscription/${communityRoute}`}
    >
      <Button
        className={`subscribe-button ${isSubscribed ? "un" : ""}subscribe ${
          fetcher.state !== "idle" ? "disabled" : ""
        }`}
        type="submit"
      >
        <Icon className="subscribe-button__icon" />
        {isSubscribed ? "Uns" : "S"}ubscribe
      </Button>
      <input
        type="hidden"
        name="setSubscribe"
        value={(!isSubscribed).toString()}
      />
    </fetcher.Form>
  );
};

export default SubscribeButton;
