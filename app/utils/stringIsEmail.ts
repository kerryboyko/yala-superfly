export const stringIsEmail = (str: string): boolean =>
  /(\w\.?)+@[\w\.-]+\.\w{2,}/.test(str);
