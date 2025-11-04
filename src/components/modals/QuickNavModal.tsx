// src/components/modals/QuickNavModal.tsx
// [NEW] Modal สำหรับนำทางด่วน (เมนูลัด)

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { ModalBase } from './ModalBase';
import { MapPin } from 'phosphor-react';

export const QuickNavModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  // [NEW] ดึงรายการห้องจาก store ข้อมูล
  const rooms = useAppStore((state) => state.rooms);

  // [NEW] Handler สำหรับการ Jump (เลื่อนจอ)
  const handleJumpToRoom = (roomId: string) => {
    onClose(); // ปิด Modal ก่อน
    
    setTimeout(() => {
      const roomElement = document.getElementById(roomId);
      if (roomElement) {
        roomElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // [NEW] กระพริบ (Highlight) ห้องนั้น
        roomElement.classList.add('highlight');
        setTimeout(() => roomElement.classList.remove('highlight'), 1500);
      } else {
        alert('ไม่พบห้องที่ต้องการ');
      }
    }, 100); // หน่วงเวลาเล็กน้อยให้ Modal ปิด
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="นำทางด่วน (Quick Nav)"
      size="sm"
    >
      {/* (ใช้ CSS .quick-nav-list จาก main.css) */}
      <div className="quick-nav-list">
        {rooms.length === 0 ? (
          <p>(ไม่มีห้อง)</p>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              type="button"
              className="btn btn-menu"
              onClick={() => handleJumpToRoom(room.id)}
            >
              <MapPin size={24} />
              {room.room_name || `(ห้อง ${room.id.substring(0, 4)})`}
            </button>
          ))
        )}
      </div>
    </ModalBase>
  );
};