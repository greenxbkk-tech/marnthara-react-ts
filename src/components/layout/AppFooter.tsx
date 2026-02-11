// src/components/layout/AppFooter.tsx
// [FIXED] แก้ไข Loop นรกขั้นเด็ดขาด (Atomic Selection)

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { fmtTH } from '../../lib/utils';
import { Compass } from 'phosphor-react';
// [REMOVED] ไม่ต้องใช้ shallow หรือ CALC ที่นี่อีกต่อไป

// (QuickNavButton ... ไม่เปลี่ยนแปลง)
const QuickNavButton: React.FC = () => {
  const openQuickNavModal = useUIStore((state) => state.openQuickNavModal);
  return (
    <button
      className="btn btn-secondary"
      id="quickNavBtn"
      onClick={openQuickNavModal}
    >
      <Compass size={20} weight="regular" />
      <span>นำทางด่วน</span>
    </button>
  );
};

export const AppFooter: React.FC = () => {
  // [FIXED]
  // นี่คือวิธีแก้ที่ "ทนทาน" ที่สุด:
  // ดึงค่า Primitive (ตัวเลข) ทีละตัวโดยตรง
  // การเลือก (select) แบบนี้จะ "นิ่ง" และ "เสถียร" เสมอ
  const subTotal = useAppStore((state) => state.subTotal);
  const discountAmount = useAppStore((state) => state.discountAmount);
  const grandTotal = useAppStore((state) => state.grandTotal);

  const openDiscountModal = useUIStore((state) => state.openDiscountModal);

  return (
    <footer className="summary-footer">
      <div className="summary-grid">
        <div className="footer-actions">
          <QuickNavButton />
        </div>
        
        <button
          className="footer-totals"
          id="discountBtn"
          onClick={openDiscountModal}
        >
          <div className="totals-inner">
            <div className="totals-row">
              <div className="label">รวมย่อย</div>
              <div className="value">{fmtTH(subTotal)}</div>
            </div>
            <div className="totals-row">
              <div className="label">ส่วนลด</div>
              <div className="value">- {fmtTH(discountAmount)}</div>
            </div>
            <div className="totals-row grand">
              <div className="label">รวมทั้งหมด</div>
              <div className="value">{fmtTH(grandTotal)}</div>
            </div>
          </div>
        </button>
      </div>
    </footer>
  );
};

export default AppFooter;