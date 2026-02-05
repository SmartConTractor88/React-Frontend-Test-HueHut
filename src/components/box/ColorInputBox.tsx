import { useLayoutEffect, useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ColorInputBox.module.css";

type Props = {
  anchorRect: DOMRect;
  open: boolean;
  hex: string;                    // shared hex WITHOUT #
  onChange: (hex: string) => void;
  onApply: (hex: string) => void;
  onClose: () => void;
};

const sanitizeHex = (value: string) =>
  value.replace(/[^0-9A-F]/gi, "").toUpperCase().slice(0, 6);

type HSV = { h: number; s: number; v: number };

function hexToHSV(hex: string): HSV {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

function hsvToHex(h: number, s: number, v: number): string {
  let c = v * s;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = v - c;
  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 4) =>
  Math.round(value * 10 ** precision) / 10 ** precision;


export default function ColorInputBox({
  anchorRect,
  open,
  hex,
  onChange,
  onApply,
  onClose,
}: Props) {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [style, setStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const initialHSVRef = useRef<HSV | null>(null);
  const initialHexRef = useRef<string | null>(null);

  const [selectedHue, setSelectedHue] = useState<number>(0);
  const [matrixSV, setMatrixSV] = useState<{ s: number; v: number }>({ s: 0, v: 0 });

  function hsvToRgb(h: number, s: number, v: number) {
    let c = v * s;
    let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    let m = v - c;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
    else if (h >= 60 && h < 120) [r, g, b] = [x, c, 0];
    else if (h >= 120 && h < 180) [r, g, b] = [0, c, x];
    else if (h >= 180 && h < 240) [r, g, b] = [0, x, c];
    else if (h >= 240 && h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return `rgb(${Math.round((r + m) * 255)},${Math.round((g + m) * 255)},${Math.round((b + m) * 255)})`;
  }

  const handleHueMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const slider = e.currentTarget.parentElement!;
    const rect = slider.getBoundingClientRect();

    const updateHueFromClientX = (clientX: number) => {
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const hRaw = (x / rect.width) * 360;
      const h = round(clamp(hRaw, 0, 360), 2);

      setSelectedHue(h);

      const hex = hsvToHex(h, matrixSV.s, matrixSV.v);
      onChange(hex);
    };

    updateHueFromClientX(e.clientX);

    const onMove = (ev: MouseEvent) => updateHueFromClientX(ev.clientX);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleMatrixMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    const updateFromClient = (clientX: number, clientY: number) => {
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);

      const sRaw = x / rect.width;
      const vRaw = 1 - y / rect.height;

      const s = round(clamp(sRaw, 0, 1), 4);
      const v = round(clamp(vRaw, 0, 1), 4);

      setMatrixSV({ s, v });

      const hex = hsvToHex(selectedHue, s, v);
      onChange(hex);
    };

    updateFromClient(e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => updateFromClient(ev.clientX, ev.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  /* ---------------- POSITIONING ---------------- */

  useLayoutEffect(() => {
    if (!popupRef.current || !open) return;

    const margin = 8;
    const popupWidth = popupRef.current.getBoundingClientRect().width;

    let left =
      anchorRect.left +
      anchorRect.width / 2 -
      popupWidth / 2;

    const minLeft = margin;
    const maxLeft = window.innerWidth - popupWidth - margin;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    const top = anchorRect.bottom + 10;

    setStyle({ left, top });
  }, [anchorRect, open]);

  /* ---------------- FOCUS ON OPEN ---------------- */
  
  useEffect(() => {
    if (!open) return;

    // Capture committed state once per open
    if (!initialHSVRef.current) {
      initialHexRef.current = hex;

      const hsv = hexToHSV(hex);
      initialHSVRef.current = hsv;

      setSelectedHue(hsv.h);
      setMatrixSV({ s: hsv.s, v: hsv.v });
    }

    requestAnimationFrame(() => inputRef.current?.select());

  }, [open]);

  useEffect(() => {
    if (open) return;

    initialHSVRef.current = null;
    initialHexRef.current = null;

  }, [open]);

  const handleCancel = () => {
    if (initialHexRef.current) {
      onChange(initialHexRef.current);
    }
    onClose();
  };

  const handleApply = () => {
    onApply(hex);
    onClose();
  };

  /* ---------------- KEYBOARD SHORTCUTS ---------------- */

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCancel();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        handleApply();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onApply, onClose]);

    const footprint = initialHSVRef.current;

  const hueFootprintStyle = footprint
    ? { left: `${(footprint.h / 360) * 100}%` }
    : undefined;

  const matrixFootprintStyle = footprint
    ? {
        left: `${footprint.s * 100}%`,
        top: `${(1 - footprint.v) * 100}%`,
      }
    : undefined;

  useEffect(() => {
    if (!open) return;
    if (hex.length !== 6) return;

    const hsv = hexToHSV(hex);

    setSelectedHue(round(clamp(hsv.h, 0, 360), 2));
    setMatrixSV({
      s: round(clamp(hsv.s, 0, 1), 4),
      v: round(clamp(hsv.v, 0, 1), 4),
    });

  }, [hex, open]);

  /* ---------------- RENDER ---------------- */

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1009,
            }}
            onMouseDown={handleCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup */}
          <motion.div
            ref={popupRef}
            className={styles.popup}
            style={{
              left: style.left,
              top: style.top,
              width: "12.5vw",
            }}
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* HEX INPUT */}
            <input
              ref={inputRef}
              className={styles.hex_input}
              value={hex}
              onChange={(e) => onChange(sanitizeHex(e.target.value))}
              spellCheck={false}
            />

            {/* 2D MATRIX */}
            <div className={styles.matrix}
              style={{
                background: `
                  linear-gradient(to right, #fff, ${hsvToRgb(selectedHue, 1, 1)}),
                  linear-gradient(to top, #000, rgba(0,0,0,0))
                `
              }}
              onMouseDown={handleMatrixMouseDown}
            >
              {footprint && (
                <div
                  className={styles.matrix_footprint}
                  style={matrixFootprintStyle}
                />
              )}

              {/* Vertical guideline */}
              <div
                className={styles.matrix_guideline_vertical}
                style={{ left: `${matrixSV.s * 100}%` }}
              />

              {/* Horizontal guideline */}
              <div
                className={styles.matrix_guideline_horizontal}
                style={{ top: `${(1 - matrixSV.v) * 100}%` }}
              />

              {/* Matrix cursor */}
              <div
                className={styles.matrix_cursor}
                style={{
                  left: `${matrixSV.s * 100}%`,
                  top: `${(1 - matrixSV.v) * 100}%`,
                }}
              />
            </div>

            {/* HUE SLIDER */}
            <div className={styles.hue_slider}>
              {footprint && (
                <>
                  <div
                    className={styles.hue_footprint}
                    style={hueFootprintStyle}
                  />
                  <div
                    className={styles.hue_cursor}
                    style={{ left: `${(selectedHue / 360) * 100}%` }}
                    onMouseDown={handleHueMouseDown}
                  />
                </>
              )}
            </div>

            {/* ACTIONS */}
            <div className={styles.actions}>
              <button className={styles.cancel} onClick={handleCancel}>
                Cancel
              </button>
              <button className={styles.apply} onClick={handleApply}>
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
