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

import styles from "./ColorBlock.module.css";
import { isDarkColor } from "../tools/colorUtils";

export type ColorItem = {
  id: string;
  hex: string;
  locked: boolean;
};

type Props = {
  color: ColorItem;
  copied: boolean;
  onCopy: (id: string, hex: string) => void;
  onToggleLock: (id: string) => void;
  dragListeners: any;
};

export default function ColorBlock({
  color,
  copied,
  onCopy,
  onToggleLock,
  dragListeners
}: Props) {
  const dark = isDarkColor(color.hex);

  return (
    <div
      className={styles.color_block}
      style={{ backgroundColor: color.hex }}
    >
      <div
        className={`${styles.hex_code} ${
          dark ? styles.light_text : styles.dark_text
        }`}
      >
        {color.hex.replace("#", "").toUpperCase()}
      </div>

      <div
        className={`${styles.color_features} ${
          dark ? styles.light_text : styles.dark_text
        }`}
      >
        {/* copy */}
        {copied ? (
          <FaCheck className={styles.color_block_copied} />
        ) : (
          <FaCopy
            className={styles.color_block_copy}
            onClick={() => onCopy(color.id, color.hex)}
            style={{ cursor: "pointer" }}
          />
        )}

        {/* drag */}
        <FaArrowsAltH
          {...dragListeners}
          className={styles.color_block_drag}
          style={{ cursor: "grab" }}
        />

        {/* lock */}
        {color.locked ? (
          <FaLock
            className={styles.color_block_locked}
            onClick={() => onToggleLock(color.id)}
          />
        ) : (
          <FaLockOpen
            className={styles.color_block_unlocked}
            onClick={() => onToggleLock(color.id)}
          />
        )}

        <FaRegHeart className={styles.color_block_regheart} />
        <FaHeart className={styles.color_block_solheart} />
        <FaTimes className={styles.color_block_remove} />
      </div>
    </div>
  );
}
