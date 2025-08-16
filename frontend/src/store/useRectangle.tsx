import { create } from "zustand";
import type { Rectangle } from "../types/rectangles";

interface RectanglesState {
  rectangles: Rectangle[];
  addRectangle: (rect: Rectangle) => void;
  updateRectanglePosition: (id: string, x: number, y: number) => void;
  setRectangles: (rects: Rectangle[]) => void;
}

export const useRectangles = create<RectanglesState>((set) => ({
  rectangles: [],
  addRectangle: (rect) =>
    set((state) => ({ rectangles: [...state.rectangles, rect] })),
  updateRectanglePosition: (id, x, y) =>
    set((state) => ({
      rectangles: state.rectangles.map((r) =>
        r.id === id ? { ...r, x, y } : r
      ),
    })),
  setRectangles: (rects) => set({ rectangles: rects }),
}));
