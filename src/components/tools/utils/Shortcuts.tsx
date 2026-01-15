import { isMacOS } from "./Platform";

const isMac = isMacOS();

export const shortcuts = {
  generate: "Space",

  undo: isMac ? "⌘ Z" : "Ctrl Z",

  redo: isMac
    ? "⌘ ⇧ Z"
    : "Ctrl Y"
};
