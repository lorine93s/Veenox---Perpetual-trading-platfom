export function filterAllowedCharacters(value: string): string {
  const commaPos = value.indexOf(".");
  if (commaPos >= 0) {
    return (
      value.substring(0, commaPos) +
      "." +
      value.substring(commaPos + 1).replace(/[^\d]/g, "")
    );
  } else {
    return value.replace(/[^\d.,]/g, "");
  }
}
