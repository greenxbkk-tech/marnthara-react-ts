// src/components/RoomList.tsx
import React from 'react';
import { useAppStore } from '../store/store';

/**
 * RoomList component
 * - ส่งออกเป็น named export { RoomList } เพื่อให้สอดคล้องกับ App.tsx
 * - export default ด้วยเผื่อที่อื่นยัง import แบบ default
 * - ใช้ any กับ state selector เพื่อหลีกเลี่ยงปัญหาชนิดที่ยังไม่ชัดเจนในโค้ดต้นฉบับ
 */
export const RoomList: React.FC = () => {
  const rooms = useAppStore((s: any) => s.rooms ?? []);

  return (
    <section id="room-list" className="room-list">
      {rooms.length > 0 ? (
        rooms.map((room: any) => (
          <div key={room.id} className="room-item">
            <div className="room-name">{room.room_name ?? 'ห้อง (ไม่มีชื่อ)'}</div>
            {/* เพิ่มข้อมูลอื่น ๆ ตามต้องการ เช่น สถานะ, รายการสินค้า ฯลฯ */}
          </div>
        ))
      ) : (
        <div className="no-rooms">ยังไม่มีห้อง</div>
      )}
    </section>
  );
};

export default RoomList;