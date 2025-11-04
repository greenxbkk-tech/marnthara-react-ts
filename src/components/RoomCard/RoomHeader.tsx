// src/components/RoomCard/RoomHeader.tsx
// [NEW] คอมโพเนนต์ส่วนหัว (Summary) ของ RoomCard

import React, { useState, useEffect } from 'react';
import { RoomData } from '../../store/types';
import { useAppStore } from '../../store/store';
import { CALC } from '../../lib/calculations';
import { fmtTH } from '../../lib/utils';
import {
  CaretDown,
  DotsThreeVertical,
  Trash,
  PauseCircle,
  PlayCircle,
  Copy,
} from 'phosphor-react';

interface RoomHeaderProps {
  room: RoomData;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ room }) => {
  // [NEW] ดึง Actions ที่เกี่ยวข้องกับ Room
  const { updateRoom, deleteRoom, toggleRoomSuspension } = useAppStore(
    (state) => ({
      updateRoom: state.updateRoom,
      deleteRoom: () => state.deleteRoom(room.id),
      toggleRoomSuspension: () =>
        state.updateRoom(room.id, { is_suspended: !room.is_suspended }),
    })
  );

  // [NEW] Local state สำหรับจัดการ Input (กันการ re-render ทั้งแอปทุกครั้งที่พิมพ์)
  const [localName, setLocalName] = useState(room.room_name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // [NEW] ถ้า Prop (room.room_name) เปลี่ยนจากข้างนอก ให้อัปเดต local state
  useEffect(() => {
    if (room.room_name !== localName) {
      setLocalName(room.room_name);
    }
  }, [room.room_name]);

  // [NEW] Handler สำหรับอัปเดตชื่อใน Store (เมื่อ Blur)
  const handleNameBlur = () => {
    if (localName.trim() !== room.room_name) {
      updateRoom(room.id, { room_name: localName.trim() || 'ห้อง (ไม่มีชื่อ)' });
    }
  };

  // [NEW] คำนวณสรุปย่อของห้อง (Room Brief)
  const roomTotal = room.items.reduce(
    (sum, item) => sum + CALC.calculateItemPrice(item).total,
    0
  );
  const brief = `${room.items.length} รายการ | ${fmtTH(roomTotal)} บาท`;

  return (
    <summary>
      <div className="room-header-controls">
        <div className="form-group">
          {/* [NEW] ใช้ Local state 'localName' และอัปเดต Store 'onBlur' */}
          <input
            type="text"
            className="room-name-input"
            aria-label="ชื่อห้อง"
            placeholder="ตั้งชื่อห้อง"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleNameBlur}
            // (ป้องกัน <details> สลับการพับ/กาง ตอนคลิก Input)
            onClick={(e) => e.preventDefault()} 
          />
        </div>

        {/* --- Room Options Menu (CSS จาก main.css) --- */}
        <div className="room-options-container">
          <button
            type="button"
            className="btn-icon"
            title="ตัวเลือกห้อง"
            onClick={(e) => {
              e.preventDefault(); // ป้องกัน <details>
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <DotsThreeVertical size={24} weight="bold" />
          </button>
          
          <div className={`room-options-menu ${isMenuOpen ? 'show' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); toggleRoomSuspension(); setIsMenuOpen(false); }}>
              {room.is_suspended ? (
                <PlayCircle size={20} />
              ) : (
                <PauseCircle size={20} />
              )}
              {room.is_suspended ? 'เปิดใช้งานห้อง' : 'ระงับการคำนวณ'}
            </a>
            {/* (Duplicate Room - Coming Soon) */}
            {/* <a href="#"><Copy size={20} /> คัดลอกห้อง</a> */}
            <hr />
            <a href="#" className="danger" onClick={(e) => { e.preventDefault(); deleteRoom(); setIsMenuOpen(false); }}>
              <Trash size={20} />
              ลบห้องนี้
            </a>
          </div>
        </div>
        {/* --- End Menu --- */}
      </div>

      <div className="room-summary-controls">
        <span className="room-brief" data-room-brief>
          {brief}
        </span>
        <CaretDown size={24} weight="regular" className="expand-icon" />
      </div>
    </summary>
  );
};