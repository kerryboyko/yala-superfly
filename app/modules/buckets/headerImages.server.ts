import { supabaseClient } from "~/integrations/supabase";

const noop = () => null;

export const uploadHeaderImage = async (
  files: FileList,
  filename: string,
  statusCallback: (str: string, err?: any) => void | null = noop, // optional but might be useful
): Promise<{ path: string }> => {
  statusCallback("uploading");
  const { data, error } = await supabaseClient.storage
    .from("yala-header-images")
    .upload(`public/${filename}`, files[0]);
  if (error) {
    statusCallback("error", error);
    throw error;
  }
  statusCallback("success", data);
  return data;
};
