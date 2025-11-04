// src/components/RoomCard/RoomCard.tsx
// [NEW] ไฟล์นี้คือ "เปลือก" ของห้องแต่ละห้อง

import React from 'react';
import { useAppStore } from '../../store/store';
import { shallow } from 'zustand/shallow';

// Import ส่วนประกอบของห้อง
import { RoomHeader } from './RoomHeader';
import { ItemList } from '../ItemList'; // (ไฟล์นี้คุณมีแล้ว)
import { RoomFooter } from './RoomFooter';
import { Trash } from 'phosphor-react';

interface RoomCardProps {
  roomId: string; 
}

export const RoomCard: React.FC<RoomCardProps> = ({ roomId }) => {
  // ดึงข้อมูลเฉพาะห้องนี้ (และ Action)
  // ใช้ shallow เพื่อป้องกันการ re-render ที่ไม่จำเป็น
  const room = useAppStore(
    (state) => state.rooms.find(r => r.id === roomId), 
    shallow 
  );
  
  const toggleRoomOpen = useAppStore((state) => state.toggleRoomOpen);
  const toggleRoomSuspended = useAppStore((state) => state.toggleRoomSuspended);
  const deleteRoom = useAppStore((state) => state.deleteRoom);

  // Handler สำหรับการเปิด/ปิด <details>
  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // ป้องกันพฤติกรรม default ของ <details>
    toggleRoomOpen(roomId); // เรียก action จาก store
  };

  // ถ้าไม่พบห้อง (เช่น เพิ่งถูกลบ)
  if (!room) {
    return null; 
  }

  const cardClasses = `card room-card ${room.is_suspended ? 'suspended' : ''}`;

  return (
    // [NEW] ใช้ <details> ควบคุมการเปิด/ปิด
    <details className={cardClasses} id={room.id} open={room.is_open}>
      
      {/* 1. ส่วนหัว (ที่มี Input ชื่อห้อง) */}
      <RoomHeader room={room} onToggle={handleToggle} />

      {/* 2. ส่วนเนื้อหา (รายการ Items) */}
      <div className="card-content">
        <ItemList roomId={room.id} />
      </div>

      {/* 3. ส่วนท้าย (ปุ่ม Add Item) */}
      <RoomFooter roomId={room.id} />

      {/* 4. [NEW] ปุ่มควบคุมห้อง (ลบ/ระงับ) */}
      <div className="room-card-controls">
         <button 
           type="button" 
           className="btn-icon" 
           title={room.is_suspended ? 'เปิดใช้งานห้อง' : 'ระงับห้องนี้'}
           onClick={() => toggleRoomSuspended(room.id)}
         >
           {room.is_suspended ? 'เปิด' : 'ระงับ'}
         </button>
         <button 
           type="button" 
           className="btn-icon danger" 
           title="ลบห้องนี้"
           onClick={() => deleteRoom(room.id)}
         >
           <Trash size={16} /> ลบห้อง
         </button>
      </div>

    </details>
  );
};