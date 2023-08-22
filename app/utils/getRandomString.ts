import crypto from "crypto";

export const getRandomB64 = (bytes = 10) =>
  crypto.randomBytes(bytes).toString("base64url");
