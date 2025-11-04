// src/components/layout/AppFooter.tsx
// [UPDATED] เชื่อมปุ่ม 'นำทางด่วน' กับ QuickNavModal และแก้ปัญหา infinite re-render
import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { CALC } from '../../lib/calculations';
import { fmtTH } from '../../lib/utils';
import { Compass } from 'phosphor-react';
import { shallow } from 'zustand/shallow';

// [UPDATED] เชื่อมปุ่ม QuickNav กับ uiStore
const QuickNavButton: React.FC = () => {
  // [NEW] ดึง action จาก uiStore
  const openQuickNavModal = useUIStore((state) => state.openQuickNavModal);
  
  return (
    <button
      className="btn btn-secondary"
      id="quickNavBtn"
      onClick={openQuickNavModal} // [UPDATED]
    >
      <Compass size={20} weight="regular" />
      <span>นำทางด่วน</span>
    </button>
  );
};

export const AppFooter: React.FC = () => {
  // --- IMPORTANT FIX ---
  // ย้ายการคำนวณ totals ลงใน selector เพื่อให้ zustand เรียก getSnapshot ครั้งเดียว
  // และใช้ shallow เป็น equality function เพื่อป้องกัน re-render ถ้าผลลัพธ์ totals ไม่เปลี่ยน
  const { subTotal, discountAmount, grandTotal } = useAppStore(
    (state) => CALC.calculateSummaryTotals(state.rooms, state.discount),
    shallow
  );

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