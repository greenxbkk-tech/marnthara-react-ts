// src/components/ItemCard/ItemSummary.tsx
// [NEW] คอมโพเนนต์แสดงผลสรุปการคำนวณราคา (ใช้ร่วมกัน)

import React from 'react';
import { ItemData, WallpaperItemData } from '../../store/types';
import { CALC, PriceResult } from '../../lib/calculations';
import { fmtTH } from '../../lib/utils';
import { WarningCircle } from 'phosphor-react';

interface ItemSummaryProps {
  item: ItemData;
}

export const ItemSummary: React.FC<ItemSummaryProps> = ({ item }) => {
  // [NEW] เรียกใช้เอนจิ้นคำนวณ
  const result: PriceResult = CALC.calculateItemPrice(item);

  // [NEW] สร้างข้อความสรุป (Summary String)
  let summaryText: React.ReactNode;

  if (item.is_suspended) {
    summaryText = <span>-- ระงับการคำนวณ --</span>;
  } else if (result.total <= 0) {
    summaryText = <span>-- กรอกข้อมูลไม่ครบ --</span>;
  } else {
    // สร้างข้อความสรุปตามประเภท
    switch (item.type) {
      case 'wallpaper':
        const rolls = result.rolls || 0;
        const sqm = result.sqm ? result.sqm.toFixed(2) : '0';
        summaryText = (
          <>
            <b>{rolls}</b> ม้วน | <b>{sqm}</b> ตร.ม. | รวม <b>{fmtTH(result.total)}</b>
          </>
        );
        break;
      
      case 'set':
      case 'wooden_blind':
      case 'roller_blind':
      case 'vertical_blind':
      case 'partition':
      case 'pleated_screen':
      case 'aluminum_blind':
      default:
        summaryText = (
          <>
            รวม <b>{fmtTH(result.total)}</b>
          </>
        );
    }
  }

  // [NEW] ตรวจสอบคำเตือนเรื่องความสูง (สำหรับ Wallpaper)
  const isHeightTooLarge =
    item.type === 'wallpaper' &&
    item.height_m > 0 &&
    result.rolls === 0 &&
    result.total === 0 &&
    !item.is_suspended;

  return (
    <div className="item-summary">
      {isHeightTooLarge ? (
        <span className="height-warning">
          <WarningCircle weight="bold" /> สูงเกิน 10 ม.
        </span>
      ) : (
        summaryText
      )}
    </div>
  );
};