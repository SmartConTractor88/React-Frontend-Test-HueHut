//import styles from "./ColorPaletteGenerator.module.css";
import { usePageTitle } from "../components/hooks/usePageTitle";
import { usePalette } from "../components/hooks/usePalette";
import Toolbar from "../components/palette/Toolbar";
import Palette from "../components/palette/Palette";


export default function ColorPaletteGenerator() {

  // tab header
  usePageTitle("Generate Palettes | HueHut");

  const {
    colors,
    copiedId,
    generateColors,
    updateColor,
    toggleLock,
    handleDragEnd,
    copyHex,
    undo,
    redo,
    canUndo,
    canRedo,
    removeColor,
    addColor
  } = usePalette();

  return (
    <>
      <Toolbar
        onGenerate={generateColors}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <Palette
        colors={colors}
        copiedId={copiedId}
        onCopy={copyHex}
        onToggleLock={toggleLock}
        onRemove={removeColor}
        onDragEnd={handleDragEnd}
        onAddColor={(index, newColor) => addColor(index, newColor)}
        onUpdateColor={updateColor}
      />
    </>
  );
}



