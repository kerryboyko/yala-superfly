import fs from "fs/promises";

export const readFromMDFile = async (fileName: string): Promise<string> => {
  const file = await fs.readFile(`./app/static/markdown/${fileName}`, "utf-8");
  return file ? file.toString() : __dirname;
};
