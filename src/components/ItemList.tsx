// src/components/ItemList.tsx
// [UPDATED] อัปเดตให้ใช้ AreaBasedItem.tsx จริง

import React from 'react';
import { useAppStore } from '../store/store';

// [NEW] Import คอมโพเนนต์ Item จริงทั้งหมด
import { SetItem } from './ItemCard/SetItem';
import { WallpaperItem } from './ItemCard/WallpaperItem';
import { AreaBasedItem } from './ItemCard/AreaBasedItem'; // [UPDATED]

interface ItemListProps {
  roomId: string;
}

export const ItemList: React.FC<ItemListProps> = ({ roomId }) => {
  const items = useAppStore((state) => 
    state.rooms.find((r) => r.id === roomId)?.items ?? []
  );

  if (items.length === 0) {
    return (
      <div className="items-container" style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
        (ยังไม่มีรายการในห้องนี้)
      </div>
    );
  }

  return (
    <div className="items-container" id={`items-container-${roomId}`}>
      {items.map((item, index) => {
        const itemNumber = index + 1;
        
        // [NEW] Logic การเลือก Component (Dispatcher)
        switch (item.type) {
          case 'set':
            return (
              <SetItem
                key={item.id}
                item={item}
                roomId={roomId}
                itemNumber={itemNumber}
              />
            );
          case 'wallpaper':
            return (
              <WallpaperItem
                key={item.id}
                item={item}
                roomId={roomId}
                itemNumber={itemNumber}
              />
            );
          
          // [UPDATED]
          // ประเภทที่เหลือทั้งหมดจะถูกส่งไปที่ AreaBasedItem
          case 'wooden_blind':
          case 'roller_blind':
          case 'vertical_blind':
          case 'partition':
          case 'pleated_screen':
          case 'aluminum_blind':
            return (
              <AreaBasedItem
                key={item.id}
                item={item}
                roomId={roomId}
                itemNumber={itemNumber}
              />
            );
            
          default:
            return (
              <div key={item.id} className="item-card">
                Unknown Item Type: {item.type}
              </div>
            );
        }
      })}
    </div>
  );
};