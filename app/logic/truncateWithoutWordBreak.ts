export const truncateWithoutWordBreak = (
  str: string,
  chars: number = 50,
): string => {
  let output = "";
  let input = str.split(" ");
  while (output.length < chars && input.length > 0) {
    output = output.concat(`${input.shift()} `);
  }
  output = output.trim();
  if (output !== str) {
    output = output.concat("…");
  }
  return output;
};

export default truncateWithoutWordBreak;
