import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

type Props = {
  content: string;
  shortcut?: string;   // ← ADD THIS
  children: React.ReactNode;
  disabled?: boolean;
};

export default function Tooltip({
  content,
  shortcut,
  children,
  disabled
}: Props) {

  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0
  });

  const TOOLTIP_MARGIN = 30;
  const [arrowOffset, setArrowOffset] = useState(0);


  function show() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (disabled) return;

    const tooltipWidth = 200; // safe max width
    const viewportWidth = window.innerWidth;

    const idealLeft = rect.left + rect.width / 2;
    const minLeft = TOOLTIP_MARGIN + tooltipWidth / 2;
    const maxLeft = viewportWidth - TOOLTIP_MARGIN - tooltipWidth / 2;

    const clampedLeft = Math.min(Math.max(idealLeft, minLeft), maxLeft);

    setPosition({
      top: rect.bottom + 10,
      left: clampedLeft
    });

    setArrowOffset(idealLeft - clampedLeft);

    setVisible(true);
  }

  function hide() {
    if (disabled) return;
    setVisible(false);
  }

  function handleClick() {
    setVisible(false);
  }

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={!disabled ? show : undefined}
        onMouseLeave={!disabled ? hide : undefined}
        onMouseDown={!disabled ? handleClick : undefined}
        onClick={!disabled ? handleClick : undefined}
        className={styles.trigger}
      >
        {children}
      </div>

      {createPortal(
        <div
          className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ""}`}
          style={{
            top: position.top,
            left: position.left,
            ["--arrow-offset" as any]: `${arrowOffset}px`
          }}
        >
          <span className={styles.arrow} />

          <div className={styles.content}>
            <div className={styles.label}>{content}</div>

            {shortcut && (
              <div className={styles.shortcut}>{shortcut}</div>
            )}
          </div>

        </div>,
        document.body
      )}
    </>
  );
}
