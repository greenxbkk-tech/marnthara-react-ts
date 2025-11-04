// src/components/RoomCard/RoomCard.tsx
import React from 'react';
import { useAppStore } from '../../store/store';
import { shallow } from 'zustand/shallow'; // <-- ต้องมี Import นี้
// ...

interface RoomCardProps {
  roomId: string; 
}

export function RoomCard({ roomId }: RoomCardProps) {
  // ...

  // การใช้ shallow ตรงนี้ถูกต้องแล้ว เพราะต้องการเปรียบเทียบ object properties
  const room = useAppStore(
    (state) => state.rooms.find(r => r.id === roomId), 
    shallow 
  );

  // ... (rest of component)
}