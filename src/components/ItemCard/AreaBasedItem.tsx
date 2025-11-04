// src/components/ItemCard/AreaBasedItem.tsx
// [NEW] คอมโพเนนต์สำหรับ Item ที่คิดราคาตามพื้นที่ (มู่ลี่, ม่านม้วน ฯลฯ)

import React from 'react';
import { useAppStore } from '../../store/store';
import { AreaBasedItemData, AreaBasedItemType } from '../../store/types';
import { ITEM_CONFIG } from '../../lib/config';
import { ItemHeader } from './ItemHeader';
import { ItemSummary } from './ItemSummary';
import { toNum, fmtDimension, handleCmToMBlur } from '../../lib/utils';
import { CaretDown } from 'phosphor-react';

interface AreaBasedItemProps {
  item: AreaBasedItemData;
  roomId: string;
  itemNumber: number;
}

export const AreaBasedItem: React.FC<AreaBasedItemProps> = ({
  item,
  roomId,
  itemNumber,
}) => {
  const updateItem = useAppStore((state) => state.updateItem);
  const itemConfig = ITEM_CONFIG[item.type] || { className: 'area-based-item' };

  // [NEW] ตรวจสอบว่า Type นี้ควรมีตัวเลือก "การเปิด" หรือไม่
  const showOpeningStyle = ['partition', 'pleated_screen'].includes(item.type);
  const showAdjustmentSide = [
    'wooden_blind',
    'roller_blind',
    'vertical_blind',
    'aluminum_blind',
  ].includes(item.type);

  // [NEW] Handler กลาง
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ['width_m', 'height_m', 'price_sqyd'];
    updateItem(roomId, item.id, {
      [name]: numericFields.includes(name) ? toNum(value) : value,
    });
  };

  // [NEW] Handler สำหรับ W/H
  const handleDimensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedValue = handleCmToMBlur(e);
    updateItem(roomId, item.id, { [e.target.name]: toNum(formattedValue) });
  };
  
  // [NEW] Handler สำหรับปุ่ม "รายละเอียดเพิ่มเติม"
  const handleToggleDetails = () => {
     updateItem(roomId, item.id, { is_details_open: !item.is_details_open });
  };
  
  // [NEW] CSS Class แบบไดนามิก (เช่น 'wooden-blind-item')
  const itemClasses = `item-card ${itemConfig.className}`;

  return (
    <div className={itemClasses} id={item.id}>
      {/* 1. ส่วนหัว (ใช้ซ้ำ) */}
      <ItemHeader item={item} roomId={roomId} itemNumber={itemNumber} />

      {/* 2. ส่วนเนื้อหาหลัก (Inputs) */}
      <div className="item-grid">
        {/* --- แถว 1: W, H --- */}
        <div className="form-group">
          <label>
            กว้าง (ม.)
            <input
              type="text"
              inputMode="decimal"
              name="width_m"
              placeholder="เช่น 1.20"
              defaultValue={fmtDimension(item.width_m)}
              onBlur={handleDimensionBlur}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            สูง (ม.)
            <input
              type="text"
              inputMode="decimal"
              name="height_m"
              placeholder="เช่น 1.80"
              defaultValue={fmtDimension(item.height_m)}
              onBlur={handleDimensionBlur}
            />
          </label>
        </div>

        {/* --- แถว 2: ราคา, รหัส --- */}
        <div className="form-group">
          <label>
            ราคา (บาท/ตร.หลา)
            <input
              type="text"
              inputMode="decimal"
              name="price_sqyd"
              placeholder="0"
              defaultValue={item.price_sqyd > 0 ? item.price_sqyd : ''}
              onBlur={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            รหัส/สี
            <input
              type="text"
              name="code"
              placeholder="เช่น 1201"
              value={item.code}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* --- ปุ่ม "รายละเอียดเพิ่มเติม" --- */}
        <div className="form-group full-width-item">
          <button
            type="button"
            className={`btn btn-more ${item.is_details_open ? 'expanded' : ''}`}
            onClick={handleToggleDetails}
          >
            {item.is_details_open ? 'ซ่อนรายละเอียด' : 'รายละเอียดเพิ่มเติม'}
            <CaretDown size={16} weight="bold" />
          </button>
        </div>
      </div>
      
      {/* 3. ส่วนรายละเอียดเพิ่มเติม (Dynamic Fields, Notes) */}
      <div className={`item-details-more ${item.is_details_open ? 'show' : ''}`}>
        <div className="item-grid">
          {/* [NEW] แสดงผลแบบมีเงื่อนไข (Conditional Rendering) */}
          {showOpeningStyle && (
            <div className="form-group">
              <label>
                รูปแบบการเปิด
                <select
                  name="opening_style"
                  value={item.opening_style || 'แยกกลาง'}
                  onChange={handleChange}
                >
                  <option value="แยกกลาง">แยกกลาง</option>
                  <option value="เก็บข้างเดียว">เก็บข้างเดียว</option>
                </select>
              </label>
            </div>
          )}
          {showAdjustmentSide && (
             <div className="form-group">
              <label>
                ด้านที่ปรับ
                <select
                  name="adjustment_side"
                  value={item.adjustment_side || 'ปรับขวา'}
                  onChange={handleChange}
                >
                  <option value="ปรับขวา">ปรับขวา</option>
                  <option value="ปรับซ้าย">ปรับซ้าย</option>
                </select>
              </label>
            </div>
          )}
        </div>
        
         <div className="form-group full-width-item" style={{ paddingTop: '0.75rem' }}>
          <label>
            หมายเหตุ (สำหรับรายการนี้)
            <textarea
              name="notes"
              rows={2}
              placeholder="เช่น เพิ่มโซ่, ..."
              value={item.notes}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
      </div>

      {/* 4. ส่วนสรุปราคา (ใช้ซ้ำ) */}
      <ItemSummary item={item} />
    </div>
  );
};