const convertIfANumber = (str: string): string | number => {
  const intValue = parseInt(str, 10);
  const floatValue = parseFloat(str);

  if (intValue.toString() === str) {
    return intValue;
  }
  if (floatValue.toString() === str) {
    return floatValue;
  }

  return str;
};

export const grabQueryParams = (url: string) => {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.searchParams);
  let output: Record<string, string | number> = {};
  for (let key of params.keys()) {
    const value = params.get(key);
    if (value !== null) {
      output[key] = convertIfANumber(value);
    }
  }
  return output;
};
