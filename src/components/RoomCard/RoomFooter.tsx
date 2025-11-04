// src/components/RoomCard/RoomFooter.tsx
// [UPDATED] ลบ Props, ใช้ uiStore โดยตรง

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore'; // [NEW]
import { PlusCircle, PaintRoller, DotsThree } from 'phosphor-react';

interface RoomFooterProps {
  roomId: string;
  // [REMOVED] onOpenItemTypeModal prop
}

export const RoomFooter: React.FC<RoomFooterProps> = ({ roomId }) => {
  // Store ข้อมูล
  const addItem = useAppStore((state) => state.addItem);
  // [NEW] Store UI
  const openItemTypeModal = useUIStore((state) => state.openItemTypeModal);

  // [UPDATED] Handler สำหรับปุ่ม '...'
  const handleAddOther = (e: React.MouseEvent) => {
    e.preventDefault();
    // [NEW] เรียก store action โดยตรง
    openItemTypeModal({ action: 'add', roomId: roomId });
  };

  return (
    <div className="room-actions-footer">
      <div className="add-item-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addItem(roomId, 'set')}
        >
          <PlusCircle size={20} weight="regular" />
          เพิ่มม่านชุด
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addItem(roomId, 'wallpaper')}
        >
          <PaintRoller size={20} weight="regular" />
          เพิ่มวอลเปเปอร์
        </button>
        
        <button
          type="button"
          className="btn btn-secondary"
          title="เพิ่มรายการประเภทอื่น"
          onClick={handleAddOther} // [UPDATED]
        >
          <DotsThree size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
};