// src/hooks/useUndoRedo.ts
// [NEW] Custom Hook สำหรับเชื่อมต่อกับ Temporal (Undo/Redo) Store

import { useAppStore } from '../store/store';

/**
 * Hook สำหรับจัดการ Undo/Redo state
 * @returns {object} { undo, redo, canUndo, canRedo, clearHistory }
 */
export const useUndoRedo = () => {
  // [NEW] 'select' state ที่ temporal เพิ่มเข้ามา
  const { undo, redo, history, future, clear } = useAppStore((state) => ({
    undo: state.undo,
    redo: state.redo,
    history: state.history,
    future: state.future,
    clear: state.clear,
  }));

  const canUndo = history.length > 0;
  const canRedo = future.length > 0;

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory: clear,
  };
};