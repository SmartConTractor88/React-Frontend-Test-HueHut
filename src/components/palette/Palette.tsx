import React from "react";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from "@dnd-kit/sortable";

import ColorBlock from "./ColorBlock";
import type { ColorItem } from "./ColorBlock";

import styles from "./Palette.module.css";

type Props = {
  colors: ColorItem[];
  copiedId: string | null;
  onCopy: (id: string, hex: string) => void;
  onToggleLock: (id: string) => void;
  onDragEnd: (event: any) => void;
};

/*
  wrapper that makes one color block sortable
  it handles drag transforms and animation
*/
function SortableColorBlock({
  color,
  children
}: {
  color: { id: string };
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

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, 0px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 1000 : "auto"
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        flex: "1 1 0",
        display: "flex"
      }}
      {...attributes}
    >
      {children(listeners)}
    </div>
  );
}

export default function Palette({
  colors,
  copiedId,
  onCopy,
  onToggleLock,
  onDragEnd
}: Props) {
  /*
    drag sensor configuration
    prevents accidental dragging on click
  */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext
        items={colors.map(c => c.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className={styles.palette}>
          {colors.map(color => (
            <SortableColorBlock key={color.id} color={color}>
              {(listeners) => (
                <ColorBlock
                  color={color}
                  copied={copiedId === color.id}
                  onCopy={onCopy}
                  onToggleLock={onToggleLock}
                  dragListeners={listeners}
                />
              )}
            </SortableColorBlock>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
