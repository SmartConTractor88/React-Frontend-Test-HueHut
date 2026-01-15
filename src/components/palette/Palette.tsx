import React, { useState } from "react";

import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { motion } from "framer-motion";

import ColorBlock from "./ColorBlock";
import type { ColorItem } from "./ColorBlock";
import AddColorButton from "../rectangle/AddColorButton";

import styles from "./Palette.module.css";

type Props = {
  colors: ColorItem[];
  copiedId: string | null;
  onCopy: (id: string, hex: string) => void;
  onToggleLock: (id: string) => void;
  onRemove: (id: string) => void;
  onDragEnd: (event: any) => void;
  onAddColor?: (index: number, newColor: ColorItem) => void; // two params now
};


type GhostColor = {
  id: string;
  hex: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

// Utility: Hex → RGB
function hexToRgb(hex: string) {
  const clean = hex.replace(/^#/, '');
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Utility: RGB → Hex
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const pad = (n: number) => n.toString(16).padStart(2, '0');
  return `#${pad(r)}${pad(g)}${pad(b)}`;
}

// Average two hex colors
function averageHex(hex1: string, hex2: string) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex({
    r: Math.round((c1.r + c2.r) / 2),
    g: Math.round((c1.g + c2.g) / 2),
    b: Math.round((c1.b + c2.b) / 2)
  });
}

function SortableColorBlock({
  color,
  children
}: {
  color: ColorItem;
  children: (listeners: any) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: color.id });

  return (
    <motion.div
      ref={setNodeRef}
      layout={!isDragging}
      style={{
        flex: "1 1 0",
        display: "flex",
        transform: transform
          ? `translate3d(${transform.x}px, 0, 0)`
          : undefined,
        transition,
        zIndex: isDragging ? 1000 : "auto"
      }}
      transition={{ layout: { duration: 0.2, ease: "easeOut" } }}
      {...attributes}
    >
      {children(listeners)}
    </motion.div>
  );
}

export default function Palette({
  colors,
  copiedId,
  onCopy,
  onToggleLock,
  onRemove,
  onDragEnd,
  onAddColor
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const [ghost, setGhost] = useState<GhostColor | null>(null); // for remove
  const [addGhost, setAddGhost] = useState<GhostColor | null>(null); // for add
  
  const [hoveredEdgeIndex, setHoveredEdgeIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleRemove = (id: string) => {
    const el = document.getElementById(`color-${id}`);
    const color = colors.find(c => c.id === id);

    if (!el || !color) {
      onRemove(id);
      return;
    }

    const rect = el.getBoundingClientRect();

    setGhost({
      id,
      hex: color.hex,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });

    onRemove(id);

    setTimeout(() => setGhost(null), 150);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={() => {
          setIsDragging(true);
          setHoveredEdgeIndex(null);
        }}
        onDragEnd={(event) => {
          setIsDragging(false);
          onDragEnd(event);
        }}
      >
        <SortableContext
          items={colors.map(c => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.palette}>
            {colors.map((color, i) => (
              <div key={color.id} className={styles.block_wrapper}>
                <SortableColorBlock color={color}>
                  {(listeners) => (
                    <ColorBlock
                      color={color}
                      copied={copiedId === color.id}
                      onCopy={onCopy}
                      onToggleLock={onToggleLock}
                      onRemove={handleRemove}
                      canRemove={colors.length > 2}
                      dragListeners={listeners}
                    />
                  )}
                </SortableColorBlock>

                {/* Add button for all but last block */}
                {i < colors.length - 1 && colors.length < 8 && (
                  <div
                    className={styles.edge_hover_zone}
                    style={{ pointerEvents: isDragging ? "none" : "auto" }}
                    onMouseEnter={() => setHoveredEdgeIndex(i)}
                    onMouseLeave={() => setHoveredEdgeIndex(null)}
                  >
                    <AddColorButton
                      visible={!isDragging && hoveredEdgeIndex === i}
                      onClick={() => {
                        if (!onAddColor) return;

                        const hex = averageHex(colors[i].hex, colors[i + 1].hex);
                        const newColor: ColorItem = {
                          id: crypto.randomUUID(),
                          hex,
                          locked: false
                        };

                        // Create ghost for smooth animation
                        const el = document.getElementById(`color-${colors[i].id}`);
                        if (el) {
                          const rect = el.getBoundingClientRect();
                          setAddGhost({
                            id: newColor.id,
                            hex,
                            left: rect.right, // position at the right edge of current block
                            top: rect.top,
                            width: rect.width,
                            height: rect.height
                          });
                        }

                        // Trigger actual add after tiny delay so Framer Motion picks up layout
                        setTimeout(() => {
                          onAddColor(i, newColor);
                          setAddGhost(null); // remove ghost after add
                        }, 10);

                        setHoveredEdgeIndex(null);
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {ghost && (
        <motion.div
          style={{
            position: "fixed",
            left: ghost.left,
            top: ghost.top,
            width: ghost.width,
            height: ghost.height,
            backgroundColor: ghost.hex,
            pointerEvents: "none",
            zIndex: 1009
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        />
      )}

      {addGhost && (
        <motion.div
          style={{
            position: "fixed",
            left: addGhost.left,
            top: addGhost.top,
            width: addGhost.width,
            height: addGhost.height,
            backgroundColor: addGhost.hex,
            pointerEvents: "none",
            zIndex: 1009
          }}
          initial={{ opacity: 0.6, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        />
      )}
    </>
  );
}
