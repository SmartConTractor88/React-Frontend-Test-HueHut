//import styles from "./ColorPaletteGenerator.module.css";

import { usePalette } from "../components/hooks/usePalette";
import Toolbar from "../components/palette/Toolbar";
import Palette from "../components/palette/Palette";


export default function ColorPaletteGenerator() {

  const {
    colors,
    copiedId,
    generateColors,
    toggleLock,
    handleDragEnd,
    copyHex
  } = usePalette();

  return (
    <>
      <Toolbar
        onGenerate={generateColors}
      />

      <Palette
        colors={colors}
        copiedId={copiedId}
        onCopy={copyHex}
        onToggleLock={toggleLock}
        onDragEnd={handleDragEnd}
      />

    </>
  );
}



