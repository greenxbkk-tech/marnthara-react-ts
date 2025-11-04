// src/components/ItemCard/ItemHeader.tsx
// [UPDATED] เชื่อมปุ่ม 'เปลี่ยนประเภท' (Change Type) ให้ทำงาน

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore'; // [NEW]
import { ItemData } from '../../store/types';
import { ITEM_CONFIG } from '../../lib/config';
import {
  CaretDown,
  PauseCircle,
  PlayCircle,
  Copy,
  X,
} from 'phosphor-react';

interface ItemHeaderProps {
  item: ItemData;
  roomId: string;
  itemNumber: number;
}

export const ItemHeader: React.FC<ItemHeaderProps> = ({
  item,
  roomId,
  itemNumber,
}) => {
  // Store ข้อมูล
  const { deleteItem, duplicateItem, updateItem } = useAppStore((state) => ({
    deleteItem: state.deleteItem,
    duplicateItem: state.duplicateItem,
    updateItem: state.updateItem,
  }));
  
  // [NEW] Store UI
  const openItemTypeModal = useUIStore((state) => state.openItemTypeModal);

  const itemConfig = ITEM_CONFIG[item.type] || { name: 'รายการ' };

  // --- Handlers ---
  const handleToggleSuspend = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateItem(roomId, item.id, { is_suspended: !item.is_suspended });
  };
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateItem(roomId, item.id);
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem(roomId, item.id);
  };
  
  // [UPDATED] เชื่อมปุ่ม 'เปลี่ยนประเภท'
  const handleChangeType = (e: React.MouseEvent) => {
    e.stopPropagation();
    // [NEW] เรียก store action พร้อม context 'change'
    openItemTypeModal({
      action: 'change',
      roomId: roomId,
      itemId: item.id,
    });
  };

  return (
    <div className="item-header">
      <div className="item-title" data-item-title>
        <span>{itemNumber}.</span>
        
        {/* [UPDATED] ปุ่มนี้ทำงานแล้ว */}
        <button
          type="button"
          className="item-type-changer"
          onClick={handleChangeType} 
        >
          <span className="item-type-display">{itemConfig.name}</span>
          <CaretDown size={14} weight="bold" style={{ marginLeft: '0.25rem' }} />
        </button>
      </div>

      <div className="item-actions">
        {/* (ปุ่ม Actions อื่นๆ) */}
        <button
          type="button"
          className="btn-icon"
          title={item.is_suspended ? 'เปิดใช้งาน' : 'ระงับรายการ'}
          onClick={handleToggleSuspend}
        >
          {item.is_suspended ? (
            <PlayCircle size={22} weight="bold" />
          ) : (
            <PauseCircle size={22} weight="bold" />
          )}
        </button>
        <button
          type="button"
          className="btn-icon"
          title="คัดลอกรายการ"
          onClick={handleDuplicate}
        >
          <Copy size={22} weight="bold" />
        </button>
        <button
          type="button"
          className="btn btn-icon danger"
          title="ลบรายการ"
          onClick={handleDelete}
        >
          <X size={22} weight="bold" />
        </button>
      </div>
    </div>
  );
};