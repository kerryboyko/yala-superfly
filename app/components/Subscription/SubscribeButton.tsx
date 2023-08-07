import { useFetcher } from "@remix-run/react";
import { Loader2, MinusCircle, PlusCircle } from "lucide-react";

import subscribeButtonStyles from "~/styles/subscribe-button.css";

import { Button } from "../ui/button";

export const styles = subscribeButtonStyles;

const DisplayIcon = ({
  loadingState,
  isSubscribed,
  className,
}: {
  loadingState: "idle" | "submitting" | "loading";
  isSubscribed?: boolean;
  className?: string;
}) => {
  if (loadingState !== "idle") {
    return <Loader2 className={`loading ${className}`} />;
  }
  if (isSubscribed) {
    return <MinusCircle className={className} />;
  }
  return <PlusCircle className={className} />;
};

export const SubscribeButton = ({
  communityRoute,
  isSubscribed,
}: {
  communityRoute: string;
  isSubscribed?: boolean;
}) => {
  const fetcher = useFetcher();

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
        <DisplayIcon
          loadingState={fetcher.state}
          isSubscribed={isSubscribed}
          className="subscribe-button__icon"
        />
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
