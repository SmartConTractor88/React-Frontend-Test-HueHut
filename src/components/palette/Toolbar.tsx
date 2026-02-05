import styles from "./Toolbar.module.css";

import {
  FaRegHeart,
  FaUndo,
  FaRedo,
  FaShare,
  FaBars
} from "react-icons/fa";

import Tooltip from "../box/Tooltip"
import { shortcuts } from "../tools/utils/Shortcuts";

type Props = {
  onGenerate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};


export default function Toolbar({
  onGenerate,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: Props) {
  return (
    <div className={styles.toolbar}>
      <Tooltip content="Generate palette" shortcut={shortcuts.generate}>
        <div onClick={onGenerate} className={styles.generate}>
          Generate
        </div>
      </Tooltip>

      <div className={styles.toolbar_functions}>
        <div className={styles.undo_redo}>
          <Tooltip content="Undo" shortcut={shortcuts.undo} disabled={!canUndo}>
            <FaUndo
              onClick={canUndo ? onUndo : undefined}
              className={!canUndo ? styles.disabled : styles.clickable}
            />
          </Tooltip>

          <Tooltip content="Redo" shortcut={shortcuts.redo} disabled={!canRedo}>
            <FaRedo
              onClick={canRedo ? onRedo : undefined}
              className={!canRedo ? styles.disabled : styles.clickable}
            />
          </Tooltip>
        </div>

        <div className={styles.share_wrapper}>
          <p><FaShare/>Share</p>
        </div>

        <div className={styles.save_wrapper}>
          <p><FaRegHeart/>Save</p>
        </div>

        <FaBars/>
      </div>
    </div>
  );
}
