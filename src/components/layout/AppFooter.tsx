// src/components/layout/AppFooter.tsx
// [UPDATED] เชื่อมปุ่ม 'นำทางด่วน' กับ QuickNavModal และแก้ปัญหา infinite re-render
import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { CALC } from '../../lib/calculations';
import { fmtTH } from '../../lib/utils';
import { Compass } from 'phosphor-react';
import { shallow } from 'zustand/shallow';

// QuickNav button component (uses uiStore action)
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
  // IMPORTANT:
  // - Move derived calculation into the selector so zustand caches getSnapshot properly.
  // - Use shallow equality to avoid re-render when numeric totals don't change.
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

export default AppFooter;