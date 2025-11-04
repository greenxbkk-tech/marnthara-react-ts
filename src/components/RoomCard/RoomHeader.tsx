// src/components/RoomCard/RoomHeader.tsx
import React, { useState } from 'react';
import { useAppStore } from '../../store/store';
import type { Room } from '../../store/store'; // Import Type จาก store

interface RoomHeaderProps {
  room: Room;
  onToggle: (e: React.MouseEvent<HTMLElement>) => void;
}

export function RoomHeader({ room, onToggle }: RoomHeaderProps) {
  
  // เราจะใช้ Local State แค่ตอน "กำลังพิมพ์"
  // แต่ค่าเริ่มต้นจะมาจาก prop โดยตรง
  const [localName, setLocalName] = useState(room.room_name);
  const updateRoomName = useAppStore(state => state.updateRoomName);

  // *** เราลบ useEffect ที่ทำให้เกิด Loop ออกไปแล้ว ***
  // React จะอัปเดต localName ให้เองเมื่อ prop 'room' เปลี่ยน
  // (ซึ่งมันจะเปลี่ยนเฉพาะตอนที่ข้อมูลเปลี่ยนจริงๆ เพราะเราใช้ shallow)
  React.useEffect(() => {
    // ซิงค์ local state ถ้า prop จาก store เปลี่ยน (เช่นการ Undo)
    setLocalName(room.room_name);
  }, [room.room_name]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalName(e.target.value);
  };

  const handleNameBlur = () => {
    // อัปเดต store เมื่อ blur (ประหยัด performance)
    if (localName !== room.room_name) {
      updateRoomName(room.id, localName);
    }
  };

  return (
    <summary onClick={onToggle}>
      <h2>
        <i className="ph-bold ph-map-pin"></i>
        {/* แสดงผลจาก Local State และอัปเดต Store ตอน onBlur */}
        <input
          type="text"
          name="room_name"
          className="room-name-input"
          placeholder="ระบุชื่อห้อง..."
          value={localName}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onClick={e => e.stopPropagation()} // ป้องกัน <details> ปิดตอนคลิก input
        />
      </h2>
      <span className="room-summary-controls">
        {/* (คุณต้องเพิ่ม Logic การคำนวณ brief เอง) */}
        <span className="room-brief" data-room-brief>
          {room.items.length} รายการ
        </span>
        <i className="ph-bold ph-caret-down expand-icon"></i>
      </span>
    </summary>
  );
}