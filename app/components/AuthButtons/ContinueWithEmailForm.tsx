import React from "react";

import { useTranslation } from "react-i18next";

import { useTypedFetcher } from "~/hooks/use-fetcher";
import type { action } from "~/routes/send-magic-link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function ContinueWithEmailForm() {
  const ref = React.useRef<HTMLFormElement>(null);
  const sendMagicLink = useTypedFetcher<typeof action>();
  const { data, state, type } = sendMagicLink;
  const isSuccessFull = type === "done" && !data?.error;
  const isLoading = state === "submitting" || state === "loading";
  const { t } = useTranslation("auth");
  const buttonLabel = isLoading
    ? t("register.sendingLink")
    : t("register.continueWithEmail");

  React.useEffect(() => {
    if (isSuccessFull) {
      ref.current?.reset();
    }
  }, [isSuccessFull]);

  return (
    <sendMagicLink.Form
      method="post"
      action="/send-magic-link"
      replace={false}
      ref={ref}
    >
      <Label className="label label__email">{t("register.email")}</Label>
      <Input
        className="input input__magic-link"
        type="email"
        name="email"
        id="magic-link"
        disabled={isLoading}
        placeholder="email@domain.com"
      />
      <div
        className={`mb-2 h-6 text-center ${data?.error ? "text-red-600" : ""} ${
          isSuccessFull ? "text-green-600" : ""
        }`}
      >
        {!isSuccessFull ? data?.error : t("register.checkEmail")}
      </div>
      <Button
        className="button button__magic-link"
        type="submit"
        disabled={isLoading}
      >
        {buttonLabel}
      </Button>
    </sendMagicLink.Form>
  );
}
