export const formatCommunityName = (name: string) =>
  name.toLowerCase().replace(/[^\w\-_]/gi, "");
