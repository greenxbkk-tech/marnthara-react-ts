// src/components/RoomList.tsx
// [UPDATED] อัปเดตจาก Placeholder เป็นตัวจัดการ RoomCard จริง

import React from 'react';
import { useAppStore } from '../store/store';
import { RoomCard } from './RoomCard/RoomCard';
import { PlusCircle } from 'phosphor-react';

export const RoomList: React.FC = () => {
  // [NEW] เลือกมาเฉพาะ ID ของห้อง
  // นี่คือเทคนิคที่เสถียรที่สุด (Resilient)
  // RoomList จะ re-render *เฉพาะ* เมื่อมีการ "เพิ่ม" หรือ "ลบ" ห้องเท่านั้น
  const roomIds = useAppStore((state) => state.rooms.map(r => r.id));
  const addRoom = useAppStore((state) => state.addRoom);

  return (
    <section id="room-list-container">
      {/* 1. ส่วนแสดงผลรายการห้อง */}
      <div className="room-list">
        {roomIds.length > 0 ? (
          roomIds.map((roomId) => (
            // RoomCard แต่ละอันจะ "ฉลาด" พอที่จะดึงข้อมูลของตัวเอง
            <RoomCard key={roomId} roomId={roomId} />
          ))
        ) : (
          <div className="no-rooms-placeholder">
            <p>(ยังไม่มีห้อง)</p>
            <p>คลิก "เพิ่มห้อง" เพื่อเริ่มต้น</p>
          </div>
        )}
      </div>

      {/* 2. ปุ่มเพิ่มห้อง (ลอยอยู่ด้านล่าง) */}
      <div className="add-room-footer">
        <button
          type="button"
          className="btn btn-primary"
          id="addRoomBtn"
          onClick={addRoom}
        >
          <PlusCircle size={20} weight="regular" />
          เพิ่มห้อง
        </button>
      </div>
    </section>
  );
};

export default RoomList;