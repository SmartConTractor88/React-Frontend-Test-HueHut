{/* all palette state and behavior, but no rendering */}

import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

import colorAlgo from "../tools/ColorAlgorithm";
import { parsePaletteFromUrl } from "../tools/colorUtils";

import { isMacOS } from "../tools/utils/Platform";

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

  const colorsRef = useRef<ColorItem[]>([]);

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
        setColors(parsed.map(hex => ({ id: crypto.randomUUID(), hex, locked: false })));
        setPast([]);
        setFuture([]);
        return;
      }
    }

    setColors(Array.from({ length: 5 }, () => ({
      id: crypto.randomUUID(),
      hex: colorAlgo(),
      locked: false
    })));
    setPast([]);
    setFuture([]);
  }, [palette, colors.length]);


  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

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
    record changes
  */

  const [past, setPast] = useState<ColorItem[][]>([]);
  const [future, setFuture] = useState<ColorItem[][]>([]);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;


  function commit(nextColors: ColorItem[], recordHistory = true) {
    if (recordHistory) {
      setPast(prev => [...prev, colors]);
      setFuture([]);
    }
    setColors(nextColors);
  }

  //function commitIfChanged(next: ColorItem[]) {
  //  commit(next);
  //}

  /* 
    keyboard shortcuts 
  */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input (important for future)
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Generate (Space)
      if (e.code === "Space") {
        e.preventDefault();
        generateColors();
        return;
      }

      const isMac = isMacOS();
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }

      // Redo
      if (
        (isMac && ctrl && e.key === "z" && e.shiftKey) ||
        (!isMac && ctrl && e.key === "y")
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [generateColors, undo, redo, canUndo, canRedo]);

  /*
    generate new colors
  */
  function generateColors() {
    const next = colors.map(c =>
      c.locked ? c : { ...c, hex: colorAlgo() }
    );

    // Prevent no-op history entries
    const changed = next.some((c, i) => c.hex !== colors[i].hex);
    if (!changed) return;

    commit(next);
  }


  /*
    lock colors
  */
  function toggleLock(id: string) {
    const next = colors.map(c =>
      c.id === id ? { ...c, locked: !c.locked } : c
    );

    const shouldRecord = past.length > 0;
    commit(next, shouldRecord);
  }

  /*
    drag-and-drop
  */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = colors.findIndex(c => c.id === active.id);
    const newIndex = colors.findIndex(c => c.id === over.id);

    commit(arrayMove(colors, oldIndex, newIndex));
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


  /*
    undo / redo
  */
  function undo() {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    setPast(prev => prev.slice(0, -1));
    setFuture(prev => [colors, ...prev]);
    setColors(previous);
  }

  function redo() {
    if (future.length === 0) return;

    const next = future[0];
    setFuture(prev => prev.slice(1));
    setPast(prev => [...prev, colors]);
    setColors(next);
  }

  function removeColor(id: string) {
    if (colors.length <= 2) return; // prevent removing below 2
    const next = colors.filter(color => color.id !== id);
    commit(next);
  }

  return {
    colors,
    copiedId,
    generateColors,
    toggleLock,
    handleDragEnd,
    copyHex,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    removeColor
  };
}
