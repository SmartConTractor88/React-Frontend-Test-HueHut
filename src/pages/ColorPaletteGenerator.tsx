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
  FaHeart
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
  const [colors, setColors] = useState<string[]>([]);

  /*
    generates a new palette
    updates both the visual state and the url
  */
  function generateColors() {
    // create 5 random colors
    const newColors = Array.from({ length: 5 }, () => colorAlgo());

    // update react state
    setColors(newColors);

    /*
      convert colors into a url-safe format
      "#778899" -> "778899"
      then join them with "-"
    */
    const paletteParam = newColors
      .map(c => c.replace("#", "").toLowerCase())
      .join("-");

    /*
      update the url without adding a new history entry
      this keeps the back button behavior clean
    */
    navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });
  }

  /*
    this effect keeps the app in sync with the url

    it runs:
    - when the page loads
    - when the url palette changes
  */
  useEffect(() => {
    if (palette) {
      const parsedColors = parsePaletteFromUrl(palette);

      // if the url contains valid colors, use them
      if (parsedColors.length > 0) {
        setColors(parsedColors);
        return;
      }
    }

    /*
      if there is no palette in the url
      or the url is invalid,
      generate a new one automatically
    */
    generateColors();
  }, [palette]);

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
            className={styles.color_block}
            style={{ backgroundColor: color }}
          >
            <div className={styles.hex_code_wrapper}>
              <p className={styles.hex_code}>
                {color.toUpperCase()}
              </p>
            </div>

            <div className={styles.color_features}>
              <FaCopy />
              <FaCheck />
              <FaArrowsAltH />
              <FaLockOpen />
              <FaLock />
              <FaRegHeart />
              <FaHeart />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}


