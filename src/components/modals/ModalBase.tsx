// src/components/modals/ModalBase.tsx
// [NEW] คอมโพเนนต์พื้นฐาน (Wrapper) สำหรับ Modal ทุกตัว

import React, { useEffect } from 'react';
import { X } from 'phosphor-react';

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  footer?: React.ReactNode;
}

export const ModalBase: React.FC<ModalBaseProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
}) => {
  // [NEW] Logic ปิด Modal เมื่อกดปุ่ม 'Esc'
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // [NEW] ถ้าไม่ 'isOpen' ไม่ต้อง Render อะไรเลย
  if (!isOpen) {
    return null;
  }
  
  // [NEW] ป้องกันการคลิก Modal Content แล้วปิด (Event Bubbling)
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sizeClass = `modal-content--${size}`;

  return (
    // 1. ฉากหลัง (Backdrop) - คลิกเพื่อปิด
    <div className="modal-backdrop" onClick={onClose}>
      
      {/* 2. เนื้อหา (Content) - ใช้ CSS Class จาก main.css */}
      <div
        className={`modal-content ${sizeClass}`}
        onClick={handleContentClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* 3. ส่วนหัว Modal */}
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="ปิด"
          >
            <X size={24} weight="bold" />
          </button>
        </div>

        {/* 4. ส่วนเนื้อหา (Body) - (คือ children ที่ส่งเข้ามา) */}
        <div className="modal-body">
          {children}
        </div>

        {/* 5. ส่วนท้าย (Footer) - (ถ้ามี) */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};