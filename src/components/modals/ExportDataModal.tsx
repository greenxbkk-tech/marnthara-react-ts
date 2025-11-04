// src/components/modals/ExportDataModal.tsx
// [NEW] Modal สำหรับยืนยันการ Export ข้อมูล

import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { ModalBase } from './ModalBase';
import { exportDataAsJson } from '../../lib/data-import-export';
import { FileArrowDown } from 'phosphor-react';

export const ExportDataModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    setError(null);
    const result = exportDataAsJson(); // เรียก Logic (ไฟล์ที่ 2)
    if (result.success) {
      onClose(); // ปิด Modal
    } else {
      setError(result.message);
    }
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="สำรองข้อมูล (Export)"
      size="sm"
      footer={
        <div className="modal-actions--space-between">
          <div></div>
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExport}
            >
              <FileArrowDown size={20} />
              ดาวน์โหลด
            </button>
          </div>
        </div>
      }
    >
      <p>
        คุณต้องการดาวน์โหลดไฟล์สำรองข้อมูล (.json)
        ของโปรเจกต์นี้ใช่หรือไม่?
      </p>
      {error && <p className="form-error-message">{error}</p>}
    </ModalBase>
  );
};