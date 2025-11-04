// src/components/ItemCard/SetItem.tsx
// [NEW] คอมโพเนนต์สำหรับ "ม่านเป็นชุด" (type: 'set')

import React, { useState } from 'react';
import { useAppStore } from '../../store/store';
import { SetItemData } from '../../store/types';
import { ItemHeader } from './ItemHeader';
import { ItemSummary } from './ItemSummary';
import { toNum, fmtDimension, handleCmToMBlur } from '../../lib/utils';
import { CaretDown, SlidersHorizontal, Package } from 'phosphor-react';

interface SetItemProps {
  item: SetItemData;
  roomId: string;
  itemNumber: number;
}

export const SetItem: React.FC<SetItemProps> = ({
  item,
  roomId,
  itemNumber,
}) => {
  const updateItem = useAppStore((state) => state.updateItem);

  // [NEW] Handler กลางสำหรับอัปเดต Store
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // [NEW] แปลงค่าตัวเลขก่อนส่งเข้า Store
    const numericFields = [
      'width_m', 'height_m', 'price_per_m_raw', 'sheer_price_per_m', 'louis_price_per_m'
    ];
    
    updateItem(roomId, item.id, {
      [name]: numericFields.includes(name) ? toNum(value) : value,
    });
  };

  // [NEW] Handler สำหรับช่อง W/H ที่แปลง CM -> M
  const handleDimensionBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const formattedValue = handleCmToMBlur(e); // utils.ts
    updateItem(roomId, item.id, { [e.target.name]: toNum(formattedValue) });
  };
  
  // [NEW] Handler สำหรับปุ่ม "รายละเอียดเพิ่มเติม"
  const handleToggleDetails = () => {
     updateItem(roomId, item.id, { is_details_open: !item.is_details_open });
  };

  return (
    <div className="item-card set-item" id={item.id}>
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
              placeholder="เช่น 2.50"
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
              placeholder="เช่น 2.80"
              defaultValue={fmtDimension(item.height_m)}
              onBlur={handleDimensionBlur}
            />
          </label>
        </div>

        {/* --- แถว 2: สไตล์, ลอนผ้า --- */}
        <div className="form-group">
          <label>
            สไตล์ม่าน
            <select name="set_style" value={item.set_style} onChange={handleChange}>
              <option value="จีบ">จีบ</option>
              <option value="ตาไก่">ตาไก่</option>
              <option value="ลอน">ลอน</option>
              <option value="พับ">พับ</option>
              <option value="หลุยส์">หลุยส์</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            ลอนผ้า (ทึบ)
            <select name="fabric_variant" value={item.fabric_variant} onChange={handleChange}>
              <option value="1.5">1.5 เท่า (มาตรฐาน)</option>
              <option value="2.0">2.0 เท่า</option>
              <option value="2.5">2.5 เท่า</option>
              <option value="3.0">3.0 เท่า</option>
              <option value="เย็บสำเร็จ">เย็บสำเร็จ (ตร.หลา)</option>
            </select>
          </label>
        </div>

        {/* --- แถว 3: ราคาผ้าทึบ, รหัสผ้าทึบ --- */}
        <div className="form-group">
          <label>
            ราคาผ้าทึบ (บาท/หลา)
            <input
              type="text"
              inputMode="decimal"
              name="price_per_m_raw"
              placeholder="0"
              defaultValue={item.price_per_m_raw > 0 ? item.price_per_m_raw : ''}
              onBlur={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            รหัสผ้าทึบ
            <input
              type="text"
              name="fabric_code"
              placeholder="เช่น 8821-3"
              value={item.fabric_code}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* --- แถว 4: ราคาผ้าโปร่ง, รหัสผ้าโปร่ง --- */}
        <div className="form-group">
          <label>
            ราคาผ้าโปร่ง (บาท/หลา)
            <input
              type="text"
              inputMode="decimal"
              name="sheer_price_per_m"
              placeholder="0 (ถ้าไม่มี)"
              defaultValue={item.sheer_price_per_m > 0 ? item.sheer_price_per_m : ''}
              onBlur={handleChange}
            />
          </label>
        </div>
         <div className="form-group">
          <label>
            รหัสผ้าโปร่ง
            <input
              type="text"
              name="sheer_fabric_code"
              placeholder="เช่น 9901-1"
              value={item.sheer_fabric_code}
              onChange={handleChange}
            />
          </label>
        </div>

        {/* --- [NEW] แถว 5: ราคาหลุยส์ (ถ้าสไตล์คือหลุยส์) --- */}
        {item.set_style === 'หลุยส์' && (
          <div className="form-group full-width-item">
            <label>
              ราคาหลุยส์ (บาท/เมตร)
              <input
                type="text"
                inputMode="decimal"
                name="louis_price_per_m"
                placeholder="0"
                defaultValue={item.louis_price_per_m > 0 ? item.louis_price_per_m : ''}
                onBlur={handleChange}
              />
            </label>
          </div>
        )}

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

      {/* 3. ส่วนรายละเอียดเพิ่มเติม (Hardware, Notes) */}
      <div className={`item-details-more ${item.is_details_open ? 'show' : ''}`}>
        <fieldset>
          <legend><SlidersHorizontal size={16} /> ตั้งค่าราง</legend>
          <div className="item-grid">
            {/* (Fields ที่นี่จะอัปเดต Store เช่นกัน) */}
            <div className="form-group">
              <label>ราง<input type="text" name="track_color" value={item.track_color} onChange={handleChange}/></label>
            </div>
            <div className="form-group">
              <label>ขาจับ<input type="text" name="bracket_color" value={item.bracket_color} onChange={handleChange}/></label>
            </div>
            <div className="form-group">
              <label>หัวราง<input type="text" name="finial_color" value={item.finial_color} onChange={handleChange}/></label>
            </div>
            {item.set_style === 'ตาไก่' && (
              <div className="form-group">
                <label>สีตาไก่<input type="text" name="grommet_color" value={item.grommet_color} onChange={handleChange}/></label>
              </div>
            )}
          </div>
        </fieldset>

        {item.set_style === 'หลุยส์' && (
          <fieldset>
            <legend><Package size={16} /> ตั้งค่าหลุยส์</legend>
            <div className="item-grid">
              <div className="form-group">
                <label>เชิงหลุยส์<input type="text" name="louis_valance" value={item.louis_valance} onChange={handleChange}/></label>
              </div>
              <div className="form-group">
                <label>พู่/ตุ้งติ้ง<input type="text" name="louis_tassels" value={item.louis_tassels} onChange={handleChange}/></label>
              </div>
            </div>
          </fieldset>
        )}

        <div className="form-group full-width-item">
          <label>
            หมายเหตุ (สำหรับรายการนี้)
            <textarea
              name="notes"
              rows={2}
              placeholder="เช่น เพิ่มสายรวบ, ..."
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