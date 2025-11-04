// src/components/modals/DiscountModal.tsx
// [FIXED] แก้ไข Loop นรก โดยการใช้ Atomic Selection

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/store';
import { DiscountData } from '../../store/types';
import { toNum } from '../../lib/utils';
import { ModalBase } from './ModalBase';
import { Tag, CurrencyBtc } from 'phosphor-react';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
}) => {
  // [FIXED] แก้ไข Loop นรก:
  // ดึงค่า Primitive (type, value) มาตรงๆ (Atomic Selection)
  // ค่าเหล่านี้จะ "นิ่ง" และจะเปลี่ยนก็ต่อเมื่อค่าใน Store เปลี่ยนจริงๆ เท่านั้น
  const globalDiscountType = useAppStore((state) => state.discount.type);
  const globalDiscountValue = useAppStore((state) => state.discount.value);
  
  // Action จะนิ่งเสมอ
  const updateDiscount = useAppStore((state) => state.updateDiscount);

  // [FIXED] Local state สำหรับจัดการ Form ภายใน Modal
  // (ใช้ค่าที่ดึงมาแบบ Atomic เป็นค่าเริ่มต้น)
  const [localType, setLocalType] = useState(globalDiscountType);
  const [localValue, setLocalValue] = useState(globalDiscountValue);

  // [FIXED] เมื่อ Modal เปิด (isOpen) ให้ซิงค์ Local state กับ Global state
  // (Dependencies ตอนนี้เป็น Primitive ที่ "นิ่ง" แล้ว)
  useEffect(() => {
    if (isOpen) {
      setLocalType(globalDiscountType);
      setLocalValue(globalDiscountValue);
    }
  }, [isOpen, globalDiscountType, globalDiscountValue]); // <-- ปลอดภัยแล้ว

  // [NEW] Handler สำหรับบันทึก (อัปเดต Global state)
  const handleSave = () => {
    updateDiscount({
      type: localType,
      value: toNum(localValue),
    });
    onClose();
  };
  
  const handleCancel = () => {
    onClose();
  };

  const isPercent = localType === 'percent';
  const isAmount = localType === 'amount';

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="จัดการส่วนลดท้ายบิล"
      size="sm"
      footer={
        // [NEW] ส่งปุ่ม Actions ไปให้ ModalBase
        <div className="modal-actions--space-between">
          <div> {/* (กลุ่มปุ่มซ้าย - ว่าง) */} </div>
          <div> {/* (กลุ่มปุ่มขวา) */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              บันทึก
            </button>
          </div>
        </div>
      }
    >
      {/* เนื้อหา Modal (Body) */}
      <div className="form-grid-2">
        {/* --- ส่วนเลือกประเภท --- */}
        <div className="form-group full-width-item">
          <div className="segmented-control">
            <input
              type="radio"
              name="discount_type"
              id="discount-type-percent"
              value="percent"
              checked={isPercent}
              onChange={() => setLocalType('percent')}
            />
            <label htmlFor="discount-type-percent">
              <Tag size={20} /> เปอร์เซ็นต์ (%)
            </label>
            
            <input
              type="radio"
              name="discount_type"
              id="discount-type-amount"
              value="amount"
              checked={isAmount}
              onChange={() => setLocalType('amount')}
            />
            <label htmlFor="discount-type-amount">
              <CurrencyBtc size={20} /> จำนวนเงิน (บาท)
            </label>
          </div>
        </div>

        {/* --- ส่วนกรอกตัวเลข --- */}
        <div className="form-group full-width-item">
          <label className="visually-hidden">
            {isPercent ? 'ค่าส่วนลด (%)' : 'ค่าส่วนลด (บาท)'}
          </label>
          <input
            type="text"
            inputMode="decimal"
            name="discount_value"
            placeholder={isPercent ? 'เช่น 10' : 'เช่น 500'}
            value={localValue > 0 ? localValue : ''}
            onChange={(e) => setLocalValue(toNum(e.target.value))}
            // (Auto-focus when modal opens - [NEW])
            autoFocus
          />
        </div>
      </div>
    </ModalBase>
  );
};