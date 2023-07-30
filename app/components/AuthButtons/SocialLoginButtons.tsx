import { useCallback } from "react";
import { supabaseClient } from "~/integrations/supabase";
import socialLoginButtonStyles from "~/styles/social-login-buttons.css";

export const styles = socialLoginButtonStyles;

export const SocialLoginButtons = ({ serverUrl }: { serverUrl: string }) => {
  const handleGoogleLogin = useCallback(async () => {
    const redirectTo = `${serverUrl}/oauth/callback`;
    await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  }, [serverUrl]);

  return (
    <div className="social-login-buttons">
      <button className="sign-in-with-google" onClick={handleGoogleLogin} />
    </div>
  );
};

export default SocialLoginButtons;
