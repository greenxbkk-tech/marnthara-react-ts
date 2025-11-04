// src/components/modals/DiscountModal.tsx
// [NEW] Modal สำหรับจัดการส่วนลด (แทนที่ Logic จาก ui-modals.js)

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/store';
import { DiscountData } from '../../store/types';
import { toNum } from '../../lib/utils';
import { ModalBase } from './ModalBase'; // [NEW] ใช้ Wrapper
import { Tag, CurrencyBtc } from 'phosphor-react'; // (ใช้ Btc แทน Baht)

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
}) => {
  // [NEW] ดึง State และ Action จาก Zustand
  const { discount, updateDiscount } = useAppStore((state) => ({
    discount: state.discount,
    updateDiscount: state.updateDiscount,
  }));

  // [NEW] Local state สำหรับจัดการ Form ภายใน Modal
  const [localType, setLocalType] = useState(discount.type);
  const [localValue, setLocalValue] = useState(discount.value);

  // [NEW] เมื่อ Modal เปิด (isOpen) ให้ซิงค์ Local state กับ Global state
  useEffect(() => {
    if (isOpen) {
      setLocalType(discount.type);
      setLocalValue(discount.value);
    }
  }, [isOpen, discount]);

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