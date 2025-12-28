{/* all palette state and behavior, but no rendering */}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

import colorAlgo from "../tools/ColorAlgorithm";
import { parsePaletteFromUrl } from "../tools/colorUtils";

export type ColorItem = {
  id: string;
  hex: string;
  locked: boolean;
};

export function usePalette() {
  const { palette } = useParams();
  const navigate = useNavigate();

  const [colors, setColors] = useState<ColorItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  /*
    initialize palette
    priority:
    1. url palette
    2. generated default palette
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

    // fallback: generate default palette
    setColors(
        Array.from({ length: 5 }, () => ({
        id: crypto.randomUUID(),
        hex: colorAlgo(),
        locked: false
        }))
    );
  }, [palette, colors.length]);

  /*
    sync palette to url on change
  */
  useEffect(() => {
    if (colors.length === 0) return;

    const paletteParam = colors
      .map(c => c.hex.replace("#", "").toLowerCase())
      .join("-");

    navigate(`/colorpalettegenerator/${paletteParam}`, { replace: true });
  }, [colors, navigate]);

  /*
    generate new colors
  */
  function generateColors() {
    setColors(prev =>
        prev.map(c =>
        c.locked ? c : { ...c, hex: colorAlgo() }
        )
    );
  }


  /*
    toggle lock
  */
  function toggleLock(id: string) {
    setColors(prev =>
      prev.map(c =>
        c.id === id ? { ...c, locked: !c.locked } : c
      )
    );
  }

  /*
    handle drag reorder
  */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setColors(prev => {
      const oldIndex = prev.findIndex(c => c.id === active.id);
      const newIndex = prev.findIndex(c => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  /*
    copy hex
  */
  function copyHex(id: string, hex: string) {
    try {
      navigator.clipboard.writeText(hex.replace("#", ""));
    } catch {}

    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  }

  return {
    colors,
    copiedId,
    generateColors,
    toggleLock,
    handleDragEnd,
    copyHex
  };
}
