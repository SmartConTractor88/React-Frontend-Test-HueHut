import { useState } from "react";
import styles from "./ColorPaletteGenerator.module.css";
import colorAlgo from "./ColorAlgorithm";

export default function ColorPaletteGenerator() {
  const [colors, setColors] = useState([
    "#eeeeee",
    "#d6d6d6",
    "#b7b7b7",
    "#7b7b7b",
    "#5f5f5f"
  ]);2

  function generateColors() {
    setColors(colors.map(() => colorAlgo()));
  }

  return (
    <>
      <div className={styles.toolbar}>
        <button onClick={generateColors}>Generate</button>
        <button>Copy</button>
        <button>Save</button>
      </div>

      <div className={styles.palette}>
        {colors.map((color, index) => (
          <div
            key={index}
            className={styles.gen_color}
            style={{ backgroundColor: color }}
            draggable="true"
            data-index={index}
          >
            {color}
          </div>
        ))}
      </div>
    </>
  );
}
