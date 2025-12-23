import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ColorPaletteGenerator.module.css";
import colorAlgo from "../tools/ColorAlgorithm";
import {
  FaCopy,
  FaCheck,
  FaArrowsAltH,
  FaLockOpen,
  FaLock,
  FaRegHeart,
  FaHeart,
  FaTimes
} from "react-icons/fa";

/*
  checks whether a string is exactly 6 hexadecimal characters
  this prevents invalid values from breaking the app
*/
const isValidHex = (hex: string) =>
  /^[0-9a-fA-F]{6}$/.test(hex);

/*
  takes the palette part of the url and converts it into an array of colors

  example:
  "778899-889977-fefefe"
  becomes
  ["#778899", "#889977", "#fefefe"]
*/
const parsePaletteFromUrl = (palette: string) =>
  palette
    .split("-")                // split the url string into individual hex values
    .filter(isValidHex)        // discard anything that is not a valid hex code
    .map(hex => `#${hex.toLowerCase()}`); // normalize format for css usage

export default function ColorPaletteGenerator() {
  /*
    reads the dynamic part of the route:
    /colorpalettegenerator/:palette

    palette will be undefined if the user visits the base route
  */
  const { palette } = useParams();

  /*
    allows programmatic navigation
    we use this to update the url when new colors are generated
  */
  const navigate = useNavigate();

  /*
    colors are stored as an array of hex strings
    start empty so the url or generator decides what gets shown
  */
  type ColorItem = {
    id: string;
    hex: string;
    locked: boolean;
  };

  const [colors, setColors] = useState<ColorItem[]>([]);

  /*
    generates a new palette
    updates both the visual state and the url
  */
  
  function generateColors() {
    setColors(prevColors => {
      // first load: create default palette
      if (prevColors.length === 0) {
        const initialColors = Array.from({ length: 5 }, () => ({
          id: `${Date.now()}-${Math.random()}`,
          hex: colorAlgo(),
          locked: false
        }));

        const paletteParam = initialColors
          .map(c => c.hex.replace("#", "").toLowerCase())
          .join("-");

        navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });

        return initialColors;
      }

      // normal generation: respect locks
      const updatedColors = prevColors.map(color =>
        color.locked
          ? color
          : { ...color, hex: colorAlgo() }
      );

      const paletteParam = updatedColors
        .map(c => c.hex.replace("#", "").toLowerCase())
        .join("-");

      navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });

      return updatedColors;
    });
  }

  /*
    this effect keeps the app in sync with the url

    it runs:
    - when the page loads
    - when the url palette changes
  */
  useEffect(() => {
    // do not overwrite existing state
    if (colors.length > 0) return;

    if (palette) {
      const parsedColors = parsePaletteFromUrl(palette);

      if (parsedColors.length > 0) {
        setColors(
          parsedColors.map(hex => ({
            id: crypto.randomUUID(),
            hex,
            locked: false
          }))
        );
        return;
      }
    }

    generateColors();
  }, [palette]);

  function toggleLock(id: string) {
    setColors(prev =>
      prev.map(color =>
        color.id === id
          ? { ...color, locked: !color.locked }
          : color
      )
    );
  }

  return (
    <>
      <div className={styles.toolbar}>
        <button onClick={generateColors}>Generate</button>
        <button>Copy</button>
        <button>Save</button>
      </div>

      <div className={styles.palette}>
        {colors.map(color => (
          <div
            key={color.id}
            className={styles.color_block}
            style={{ backgroundColor: color.hex }}
          >
            <div className={styles.hex_code_wrapper}></div>

            <div className={styles.hex_code}>
              {color.hex.toUpperCase()}
            </div>

            <div className={styles.color_features}>
              <FaCopy />
              <FaCheck />
              <FaArrowsAltH />

              {color.locked ? (
                <FaLock onClick={() => toggleLock(color.id)} />
              ) : (
                <FaLockOpen onClick={() => toggleLock(color.id)} />
              )}

              <FaRegHeart />
              <FaHeart />
              <FaTimes />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


