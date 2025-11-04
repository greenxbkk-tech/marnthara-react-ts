// src/components/ItemCard/WallpaperItem.tsx
// [NEW] คอมโพเนนต์สำหรับ "วอลเปเปอร์" (type: 'wallpaper')

import React from 'react';
import { useAppStore } from '../../store/store';
import { WallpaperItemData } from '../../store/types';
import { ItemHeader } from './ItemHeader';
import { ItemSummary } from './ItemSummary';
import { toNum, fmtDimension, handleCmToMBlur } from '../../lib/utils';
import { Plus, Trash } from 'phosphor-react';

interface WallpaperItemProps {
  item: WallpaperItemData;
  roomId: string;
  itemNumber: number;
}

export const WallpaperItem: React.FC<WallpaperItemProps> = ({
  item,
  roomId,
  itemNumber,
}) => {
  const updateItem = useAppStore((state) => state.updateItem);

  // [NEW] Handler กลาง
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = ['height_m', 'price_per_roll', 'install_cost_per_roll'];
    updateItem(roomId, item.id, {
      [name]: numericFields.includes(name) ? toNum(value) : value,
    });
  };

  // [NEW] Handler สำหรับ W/H
  const handleDimensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedValue = handleCmToMBlur(e);
    updateItem(roomId, item.id, { [e.target.name]: toNum(formattedValue) });
  };

  // --- Wall Input Handlers ---

  const handleWallChange = (index: number, value: number) => {
    const newWidths = [...(item.widths || [0])];
    newWidths[index] = value;
    updateItem(roomId, item.id, { widths: newWidths });
  };

  const handleAddWall = () => {
    const newWidths = [...(item.widths || []), 0];
    updateItem(roomId, item.id, { widths: newWidths });
  };

  const handleRemoveWall = (index: number) => {
    // ป้องกันการลบผนังสุดท้าย
    if (item.widths.length <= 1) return;
    const newWidths = item.widths.filter((_, i) => i !== index);
    updateItem(roomId, item.id, { widths: newWidths });
  };

  return (
    <div className="item-card wallpaper-item" id={item.id}>
      {/* 1. ส่วนหัว (ใช้ซ้ำ) */}
      <ItemHeader item={item} roomId={roomId} itemNumber={itemNumber} />

      {/* 2. ส่วนเนื้อหาหลัก (Inputs) */}
      <div className="item-grid">
        {/* --- แถว 1: H, รหัส --- */}
        <div className="form-group">
          <label>
            สูง (ม.)
            <input
              type="text"
              inputMode="decimal"
              name="height_m"
              placeholder="เช่น 2.80"
              defaultValue={fmtDimension(item.height_m)}
              onBlur={handleDimensionBlur}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            รหัสวอลเปเปอร์
            <input
              type="text"
              name="code"
              placeholder="เช่น L-123"
              value={item.code}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* --- แถว 2: ราคา, ค่าติดตั้ง --- */}
        <div className="form-group">
          <label>
            ราคา (บาท/ม้วน)
            <input
              type="text"
              inputMode="decimal"
              name="price_per_roll"
              placeholder="0"
              defaultValue={item.price_per_roll > 0 ? item.price_per_roll : ''}
              onBlur={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            ค่าติดตั้ง (บาท/ม้วน)
            <input
              type="text"
              inputMode="decimal"
              name="install_cost_per_roll"
              placeholder="300"
              // [NEW] แสดง '0' ถ้าค่าเป็น 0
              defaultValue={
                item.install_cost_per_roll >= 0
                  ? item.install_cost_per_roll
                  : ''
              }
              onBlur={handleChange}
            />
          </label>
        </div>
      </div>

      {/* 3. ส่วนจัดการผนัง (Dynamic Inputs) */}
      <div className="walls-section">
        <p>ความกว้างผนัง (เมตร):</p>
        <div className="walls-container">
          {(item.widths || [0]).map((width, index) => (
            <div className="wall-input-row" key={index}>
              <label className="visually-hidden">ผนังที่ {index + 1}</label>
              <input
                type="text"
                inputMode="decimal"
                name={`wall_width_m_${index}`}
                placeholder="เช่น 3.50"
                defaultValue={fmtDimension(width)}
                onBlur={(e) => {
                  const formattedVal = handleCmToMBlur(e);
                  handleWallChange(index, toNum(formattedVal));
                }}
              />
              <button
                type="button"
                className="btn btn-icon danger btn-icon-small btn-remove-dimension-row"
                title="ลบผนัง"
                onClick={() => handleRemoveWall(index)}
                disabled={item.widths.length <= 1}
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-add-wall"
          onClick={handleAddWall}
        >
          <Plus size={16} /> เพิ่มผนัง
        </button>
      </div>

      {/* 4. หมายเหตุ (Wallpaper อยู่นอก "รายละเอียดเพิ่มเติม") */}
      <div className="item-grid" style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--outline)' }}>
         <div className="form-group full-width-item">
          <label>
            หมายเหตุ (สำหรับรายการนี้)
            <textarea
              name="notes"
              rows={2}
              placeholder="เช่น ติดตั้งแนวตั้ง, ..."
              value={item.notes}
              onChange={handleChange}
            ></textarea>
          </label>
        </div>
      </div>

      {/* 5. ส่วนสรุปราคา (ใช้ซ้ำ) */}
      <ItemSummary item={item} />
    </div>
  );
};