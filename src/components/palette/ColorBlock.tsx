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
import Tooltip from "../box/Tooltip";

import { useRef, useState } from "react";
import ColorInputBox from "../box/ColorInputBox";

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
  onRemove: (id: string) => void;
  onUpdateColor: (id: string, hex: string) => void;
  canRemove: boolean;
  dragListeners: any;
  disableTooltips?: boolean;
  onPickerOpen: () => void;
  onPickerClose: () => void;
  pickerActive: boolean;
  pickerLocked: boolean;
};

export default function ColorBlock({
  color,
  copied,
  onCopy,
  onToggleLock,
  onRemove,
  onUpdateColor,
  canRemove,
  dragListeners,
  disableTooltips = false,
  onPickerOpen,
  onPickerClose,
  pickerActive,
  pickerLocked
}: Props) {
  const hexRef = useRef<HTMLDivElement>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Live preview only
  const [previewHex, setPreviewHex] = useState<string | null>(null);
  const displayHex = previewHex ?? color.hex;
  const dark = isDarkColor(displayHex);

  const normalizeHex = (value: string) => {
    if (value.length === 0) return "000000";
    return (value + "000000").slice(0, 6);
  };

  const sanitizeHex = (value: string) =>
    value.replace(/[^0-9A-F]/gi, "").toUpperCase().slice(0, 6);

  const [editingHex, setEditingHex] = useState<string | null>(null);
  

  return (
    <>
      <div className={styles.color_block_wrapper}>
        <div
          id={`color-${color.id}`}
          className={styles.color_block}
          style={{ backgroundColor: displayHex }}
        >
          {/* ---------- HEX WRAPPER ---------- */}
          <div
            ref={hexRef}
            className={`${styles.hex_code} ${
              dark ? styles.light_text : styles.dark_text
            }`}
            tabIndex={0}
            onClick={(e) => {
              if (pickerLocked && !pickerActive) return;
              e.stopPropagation();
              onPickerOpen();
              setPickerOpen(true);

              if (!hexRef.current) return;

              setEditingHex(color.hex.replace("#", ""));
              setAnchorRect(hexRef.current.getBoundingClientRect());
              setPickerOpen(true);

              requestAnimationFrame(() => {
                const sel = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(hexRef.current!);
                sel?.removeAllRanges();
                sel?.addRange(range);
              });
            }}
            onKeyDown={(e) => {
              if (!editingHex) return;

              if (e.key === "Enter") {
                e.preventDefault();
                onUpdateColor(color.id, `#${normalizeHex(editingHex)}`);
                setPreviewHex(null);                 
                setEditingHex(null);
                onPickerClose();
                setPickerOpen(false);
                return;
              }

              if (e.key === "Escape") {
                e.preventDefault();
                setPreviewHex(null);              
                setEditingHex(null);
                onPickerClose();
                setPickerOpen(false);
                return;
              }

              if (e.key.length === 1 && !/[0-9A-Fa-f]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              const text = e.currentTarget.textContent || "";
              const clean = sanitizeHex(text);

              setEditingHex(clean);
              setPreviewHex(`#${normalizeHex(clean)}`); // live preview only
            }}

            
            style={{
              pointerEvents: pickerLocked && !pickerActive ? "none" : "auto",
            }}
          >
            {(editingHex ?? color.hex.replace("#", "")).toUpperCase()}
          </div>

          {/* ---------- ACTION ICONS ---------- */}
          <div
            className={`${styles.color_features} ${
              dark ? styles.light_text : styles.dark_text
            }`}
          >
            {copied ? (
              <FaCheck className={styles.color_block_copied} />
            ) : disableTooltips ? (
              <FaCopy
                className={styles.color_block_copy}
                onClick={() => onCopy(color.id, color.hex)}
              />
            ) : (
              <Tooltip content="Copy HEX">
                <FaCopy
                  className={styles.color_block_copy}
                  onClick={() => onCopy(color.id, color.hex)}
                />
              </Tooltip>
            )}

            {disableTooltips ? (
              <FaArrowsAltH {...dragListeners} className={styles.color_block_drag} />
            ) : (
              <Tooltip content="Drag">
                <FaArrowsAltH {...dragListeners} className={styles.color_block_drag} />
              </Tooltip>
            )}

            {color.locked ? (
              disableTooltips ? (
                <FaLock 
                  className={styles.color_block_locked}
                  onClick={() => onToggleLock(color.id)}
                />
              ) : (
                <Tooltip content="Unlock">
                  <FaLock 
                    className={styles.color_block_locked}
                    onClick={() => onToggleLock(color.id)}
                  />
                </Tooltip>
              )
            ) : (
              disableTooltips ? (
                <FaLockOpen 
                  className={styles.color_block_unlocked}
                  onClick={() => onToggleLock(color.id)}
                />
              ) : (
                <Tooltip content="Lock">
                  <FaLockOpen 
                    className={styles.color_block_unlocked}
                    onClick={() => onToggleLock(color.id)}
                  />
                </Tooltip>
              )
            )}

            <FaRegHeart className={styles.color_block_regheart} />
            <FaHeart className={styles.color_block_solheart} />

            {canRemove && (
              disableTooltips ? (
                <FaTimes
                  className={styles.color_block_remove}
                  onClick={() => onRemove(color.id)}
                />
              ) : (
                <Tooltip content="Remove">
                <FaTimes
                    className={styles.color_block_remove}
                    onClick={() => onRemove(color.id)}
                  />
                </Tooltip>
              )
            )}
          </div>
        </div>
      </div>

      {/* ---------- POPUP ---------- */}
      {pickerOpen && anchorRect && editingHex !== null && (
        <ColorInputBox
          anchorRect={anchorRect}
          open={pickerOpen}
          hex={editingHex}
          onChange={(hex) => {
            setEditingHex(hex);
            setPreviewHex(`#${normalizeHex(hex)}`);   
          }}
          onApply={() => {
            onUpdateColor(color.id, `#${normalizeHex(editingHex)}`);
            setPreviewHex(null);                      
            setEditingHex(null);
            onPickerClose();
            setPickerOpen(false);
          }}
          onClose={() => {
            setPreviewHex(null);                      
            setEditingHex(null);
            onPickerClose();
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
}

