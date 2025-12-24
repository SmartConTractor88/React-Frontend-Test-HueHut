import React, { useState, useEffect } from "react";
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

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import type { DragEndEvent } from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/*
  checks whether a string is exactly 6 hexadecimal characters
  this prevents invalid values from breaking the app
*/
const isValidHex = (hex: string) =>
  /^[0-9a-fA-F]{6}$/.test(hex);

/*
  converts the palette part of the url into an array of hex colors

  example:
  "778899-889977-fefefe"
  becomes
  ["#778899", "#889977", "#fefefe"]
*/
const parsePaletteFromUrl = (palette: string) =>
  palette
    .split("-")
    .filter(isValidHex)
    .map(hex => `#${hex.toLowerCase()}`);

/*
  single color item shape
  id is required for react keys and drag-and-drop
*/
type ColorItem = {
  id: string;
  hex: string;
  locked: boolean;
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

export default function ColorPaletteGenerator() {
  /*
    reads the dynamic palette segment from the route
  */
  const { palette } = useParams();

  /*
    allows programmatic navigation to update the url
  */
  const navigate = useNavigate();

  /*
    stores the current palette state
  */
  const [colors, setColors] = useState<ColorItem[]>([]);

  /*
    drag sensor configuration
    prevents accidental dragging on click
  */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  /*
    generates new colors while respecting locked ones
    also updates the url to match the palette
  */
  function generateColors() {
    setColors(prevColors => {
      const updated =
        prevColors.length === 0
          ? Array.from({ length: 5 }, () => ({
              id: crypto.randomUUID(),
              hex: colorAlgo(),
              locked: false
            }))
          : prevColors.map(color =>
              color.locked
                ? color
                : { ...color, hex: colorAlgo() }
            );

      const paletteParam = updated
        .map(c => c.hex.replace("#", "").toLowerCase())
        .join("-");

      navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });

      return updated;
    });
  }

  /*
    reorders colors when a drag finishes
    also syncs the new order to the url
  */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setColors(prev => {
      const oldIndex = prev.findIndex(c => c.id === active.id);
      const newIndex = prev.findIndex(c => c.id === over.id);

      const reordered = arrayMove(prev, oldIndex, newIndex);

      const paletteParam = reordered
        .map(c => c.hex.replace("#", "").toLowerCase())
        .join("-");

      navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });

      return reordered;
    });
  }

  /*
    toggles the locked state of a color
  */
  function toggleLock(id: string) {
    setColors(prev =>
      prev.map(color =>
        color.id === id
          ? { ...color, locked: !color.locked }
          : color
      )
    );
  }

  /*
    syncs initial state from the url
    runs on first load and when the url changes
  */
  useEffect(() => {
    if (colors.length > 0) return;

    if (palette) {
      const parsed = parsePaletteFromUrl(palette);

      if (parsed.length > 0) {
        setColors(
          parsed.map(hex => ({
            id: crypto.randomUUID(),
            hex,
            locked: false
          }))
        );
        return;
      }
    }

    generateColors();
  }, [palette, colors.length]);

  return (
    <>
      <div className={styles.toolbar}>
        <button onClick={generateColors}>Generate</button>
        <button>Copy</button>
        <button>Save</button>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={colors.map(c => c.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className={styles.palette}>
            {colors.map(color => (
              <SortableColorBlock key={color.id} color={color}>
                {(listeners) => (
                  <div
                    className={styles.color_block}
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className={styles.hex_code}>
                      {color.hex.toUpperCase()}
                    </div>

                    <div className={styles.color_features}>
                      <FaCopy />
                      <FaCheck />
                      <FaArrowsAltH
                        {...listeners}
                        style={{ cursor: "grab" }}
                      />

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
                )}
              </SortableColorBlock>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}



