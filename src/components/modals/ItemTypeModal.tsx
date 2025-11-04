// src/components/modals/ItemTypeModal.tsx
// [NEW] Modal สำหรับเลือกประเภท Item (แทนที่ปุ่ม '...')

import React from 'react';
import { ModalBase } from './ModalBase';
import { ITEM_CONFIG } from '../../lib/config';
import { ItemType } from '../../store/types';

// [NEW] Import Icons
import {
  Rows,
  PaintRoller,
  Table,
  Scroll,
  Columns,
  Door,
  GridFour,
  SquareHalf,
} from 'phosphor-react';

// [NEW] ไอคอนสำหรับแต่ละประเภท
const TYPE_ICONS: Record<string, React.ElementType> = {
  set: Rows,
  wallpaper: PaintRoller,
  wooden_blind: Table,
  roller_blind: Scroll,
  vertical_blind: Columns,
  partition: Door,
  pleated_screen: GridFour,
  aluminum_blind: SquareHalf,
};

interface ItemTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // [NEW] Callback เมื่อผู้ใช้เลือก
  onSelectType: (type: ItemType) => void;
}

export const ItemTypeModal: React.FC<ItemTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  // [NEW] ดึง Config รายการ (ยกเว้น 'set' และ 'wallpaper' ที่เป็นปุ่มลัด)
  const otherTypes = Object.keys(ITEM_CONFIG).filter(
    (key) => key !== 'set' && key !== 'wallpaper'
  ) as ItemType[];

  const handleSelect = (type: ItemType) => {
    onSelectType(type);
    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="เลือกประเภทรายการ"
      size="sm"
    >
      {/* ใช้ CSS จาก main.css (.type-selection-list) */}
      <div className="type-selection-list">
        {otherTypes.map((type) => {
          const config = ITEM_CONFIG[type];
          const Icon = TYPE_ICONS[type] || SquareHalf;
          
          return (
            <button
              type="button"
              className="btn"
              key={type}
              onClick={() => handleSelect(type)}
            >
              <Icon size={28} weight="regular" />
              <span>{config.name}</span>
            </button>
          );
        })}
      </div>
    </ModalBase>
  );
};