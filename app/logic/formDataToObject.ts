export const formDataToObject = (formData: FormData): Record<string, any> => {
  const output: Record<string, any> = {};
  for (let entry of formData.entries()) {
    const [key, value] = entry;
    output[key] = value;
  }
  return output;
};
