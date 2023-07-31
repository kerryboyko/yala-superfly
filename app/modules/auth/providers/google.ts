import type { CredentialResponse } from "@react-oauth/google";

import { supabaseClient } from "~/integrations/supabase";

export async function handleSignInWithGoogle(response: CredentialResponse) {
  const { data, error } = await supabaseClient.auth.signInWithIdToken({
    provider: "google",
    token: response.credential || "",
    nonce: "", // must be the same one as provided in data-nonce (if any)
  });
  return { data, error };
}
