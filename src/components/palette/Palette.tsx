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
};

type GhostColor = {
  id: string;
  hex: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

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
      layout={!isDragging} // ✅ restore default behavior
      style={{
        flex: "1 1 0",
        display: "flex",
        transform: transform
          ? `translate3d(${transform.x}px, 0, 0)`
          : undefined,
        transition,
        zIndex: isDragging ? 1000 : "auto"
      }}
      transition={{
        layout: { duration: 0.2, ease: "easeOut" }
      }}
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
  onDragEnd
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const [ghost, setGhost] = useState<GhostColor | null>(null);
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

    // remove immediately → siblings animate
    onRemove(id);

    // cleanup ghost after fade
    setTimeout(() => {
      setGhost(null);
    }, 150);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToHorizontalAxis]}
        onDragStart={() => {
          setIsDragging(true);
          setHoveredEdgeIndex(null); // force-hide buttons immediately
        }}
        onDragEnd={(event) => {
          setIsDragging(false);
          onDragEnd(event); // preserve existing behavior
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
                    style={{
                      pointerEvents: isDragging ? "none" : "auto"
                    }}
                    onMouseEnter={() => setHoveredEdgeIndex(i)}
                    onMouseLeave={() => setHoveredEdgeIndex(null)}
                  >
                    <AddColorButton
                      visible={!isDragging && hoveredEdgeIndex === i}
                      onClick={() => console.log("Add color at position", i + 1)}
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
    </>
  );
}
