// src/components/modals/FavoriteFormModal.tsx
// [NEW] Modal ฟอร์ม (ใช้ซ้ำ) สำหรับ 'เพิ่ม' และ 'แก้ไข' Favorite

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore, FavFormModalContext } from '../../store/uiStore';
import { toNum } from '../../lib/utils';
import { ModalBase } from './ModalBase';

interface FavoriteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FavoriteFormModal: React.FC<FavoriteFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  // --- State & Stores ---
  const { favFormModalContext } = useUIStore();
  const { addFavorite } = useAppStore((state) => ({
    addFavorite: state.addFavorite,
  }));

  // [NEW] Local state สำหรับฟอร์ม
  const [code, setCode] = useState('');
  const [price, setPrice] = useState<number | string>('');

  const context = favFormModalContext;
  const isEditMode = context?.mode === 'edit';

  // [NEW] เมื่อ Modal เปิด (หรือ Context เปลี่ยน) ให้ตั้งค่าฟอร์ม
  useEffect(() => {
    if (isOpen && context) {
      setCode(context.mode === 'edit' ? context.code || '' : '');
      setPrice(context.mode === 'edit' ? context.price || 0 : '');
    } else {
      // เคลียร์ค่าเมื่อปิด
      setCode('');
      setPrice('');
    }
  }, [isOpen, context]);

  // --- Handlers ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !code.trim()) {
      alert('กรุณาใส่รหัส');
      return;
    }
    
    // [NEW] 'addFavorite' (จาก store) จะจัดการทั้ง 'add' และ 'update'
    addFavorite(context.type, code.trim(), toNum(price));
    onClose(); // ปิดฟอร์ม
  };

  if (!context) return null; // ไม่ Render ถ้าไม่มี Context

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'แก้ไขรายการโปรด' : 'เพิ่มรายการโปรด'}
      size="sm"
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid-1">
          <div className="form-group">
            <label htmlFor="fav_code">
              รหัส (Code)
              <input
                type="text"
                id="fav_code"
                name="fav_code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEditMode} // [NEW] ห้ามแก้รหัส (Key) ตอน Edit
                autoFocus
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="fav_price">
              ราคา (บาท)
              <input
                type="text"
                inputMode="decimal"
                id="fav_price"
                name="fav_price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                required
              />
            </label>
          </div>
        </div>
        
        <div className="modal-actions--space-between" style={{ marginTop: '1.5rem' }}>
          <div> {/* (ซ้าย) */} </div>
          <div> {/* (ขวา) */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </ModalBase>
  );
};