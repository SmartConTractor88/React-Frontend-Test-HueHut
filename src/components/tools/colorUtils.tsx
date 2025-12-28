/*
  checks whether a string is exactly 6 hexadecimal characters
  used to validate url segments and manual input later
*/
export function isValidHex(hex: string): boolean {
  return /^[0-9a-fA-F]{6}$/.test(hex);
}

/*
  determines whether a hex color is visually dark
  used to decide whether text/icons should be light or dark
*/
export function isDarkColor(hex: string): boolean {
  const cleanHex = hex.replace("#", "");

  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  // relative luminance formula
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 0.5;
}

/*
  converts the palette part of the url into an array of hex colors

  example:
  "778899-889977-fefefe"
  becomes
  ["#778899", "#889977", "#fefefe"]
*/
export function parsePaletteFromUrl(palette: string): string[] {
  return palette
    .split("-")
    .filter(isValidHex)
    .map(hex => `#${hex.toLowerCase()}`);
}

/*
  strips "#" and normalizes hex for url usage
  keeps url formatting consistent everywhere
*/
export function hexToUrl(hex: string): string {
  return hex.replace("#", "").toLowerCase();
}

/*
  converts a list of hex colors into a url-safe palette string
*/
export function paletteToUrl(colors: { hex: string }[]): string {
  return colors.map(c => hexToUrl(c.hex)).join("-");
}
