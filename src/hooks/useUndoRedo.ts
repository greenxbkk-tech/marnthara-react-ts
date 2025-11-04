// src/hooks/useUndoRedo.ts
// [UPDATED] "ตระโกนเรียก" นักบัญชี หลังการ Undo/Redo

import { useAppStore } from '../store/store';
import { shallow } from 'zustand/shallow'; // [NEW]

/**
 * Hook สำหรับจัดการ Undo/Redo state
 * @returns {object} { undo, redo, canUndo, canRedo, clearHistory }
 */
export const useUndoRedo = () => {
  // 1. ดึง state ที่เกี่ยวกับประวัติการทำงาน (past/future) และ clear
  const { past, future, clear } = useAppStore((state) => ({
    // แก้ไข: เปลี่ยน history เป็น past
    past: state.past, // นี่คือ array ของสถานะที่ผ่านมา (undo stack)
    future: state.future, // นี่คือ array ของสถานะในอนาคต (redo stack)
    clear: state.clear,
  }));

  // 2. ดึง actions สำหรับการควบคุม (temporalUndo/temporalRedo) และ recalculate
  const { temporalUndo, temporalRedo, recalculate } = useAppStore((state) => ({
    // แก้ไข: เปลี่ยนการดึง undo/redo ให้เข้าถึง state.temporal.<action>
    temporalUndo: state.temporal?.undo,
    temporalRedo: state.temporal?.redo,
    recalculate: state._recalculateTotals,
  }), shallow); 

  // ป้องกัน TypeError: ใช้ Optional Chaining (?.) หรือ Default Value (|| []) 
  // แต่เนื่องจากเราดึง past/future จาก store โดยตรงและคาดหวังว่ามันจะเป็น array 
  // หากการตั้งค่า zundo ถูกต้อง การใช้ ?. จะช่วยป้องกัน undefined ในการดึง actions ได้ดีกว่า

  // 3. คำนวณ CanUndo/CanRedo (บรรทัดที่เกิดปัญหา)
  // แม้ว่าจะเปลี่ยนชื่อเป็น past แล้ว แต่ควรตรวจสอบความปลอดภัยอีกชั้นเพื่อรับประกันว่ามันเป็น array เสมอ
  // ถ้า zundo ถูก setup อย่างถูกต้อง past และ future ควรเป็น array ว่าง [] ไม่ใช่ undefined
  const canUndo = past ? past.length > 0 : false;
  const canRedo = future ? future.length > 0 : false;

  // [NEW] สร้างฟังก์ชัน Undo/Redo ที่ "หุ้ม" ใหม่
  const undo = () => {
    // แก้ไข: ใช้ ?. เพื่อให้แน่ใจว่า temporalUndo มีอยู่ก่อนเรียกใช้
    temporalUndo?.();
    recalculate(); // "ตระโกนเรียก" นักบัญชี
  };

  const redo = () => {
    // แก้ไข: ใช้ ?. เพื่อให้แน่ใจว่า temporalRedo มีอยู่ก่อนเรียกใช้
    temporalRedo?.();
    recalculate(); // "ตระโกนเรียก" นักบัญชี
  };

  return {
    undo, // ส่งตัวที่หุ้มแล้ว
    redo, // ส่งตัวที่หุ้มแล้ว
    canUndo,
    canRedo,
    clearHistory: clear,
  };
};