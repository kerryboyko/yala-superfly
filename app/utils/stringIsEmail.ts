export const stringIsEmail = (str: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
