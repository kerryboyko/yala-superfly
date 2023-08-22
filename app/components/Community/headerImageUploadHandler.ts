import { getUserAuthedSupabaseClient } from "~/integrations/supabase/client";

export const headerImageUploadHandler = async (
  file: File,
  filename: string,
  accessToken: string,
) => {
  const client = getUserAuthedSupabaseClient(accessToken);
  const { data, error } = await client.storage
    .from("public")
    .upload(`header-images/${filename}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export default headerImageUploadHandler;
