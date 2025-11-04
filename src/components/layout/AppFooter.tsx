// src/components/layout/AppFooter.tsx
// [UPDATED] เชื่อมปุ่ม 'นำทางด่วน' กับ QuickNavModal

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { CALC } from '../../lib/calculations';
import { fmtTH } from '../../lib/utils';
import { Compass } from 'phosphor-react';

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
  const { rooms, discount } = useAppStore((state) => ({
    rooms: state.rooms,
    discount: state.discount,
  }));
  const openDiscountModal = useUIStore((state) => state.openDiscountModal);
  const { subTotal, discountAmount, grandTotal } = CALC.calculateSummaryTotals(
    rooms,
    discount
  );

  return (
    <footer className="summary-footer">
      <div className="summary-grid">
        <div className="footer-actions">
          <QuickNavButton /> {/* [UPDATED] */}
        </div>
        
        <button
          className="footer-totals"
          id="discountBtn"
          onClick={openDiscountModal}
        >
          {/* ... (โค้ดแสดงราคารวม) ... */}
        </button>
      </div>
    </footer>
  );
};