// src/components/modals/ImportDataModal.tsx
// [NEW] Modal สำหรับนำเข้าข้อมูล

import React, { useState } from 'react';
import { useUIStore } from '../../store/uiStore';
import { ModalBase } from './ModalBase';
import { importDataFromFile } from '../../lib/data-import-export';
import { FileArrowUp, CheckCircle, WarningCircle } from 'phosphor-react';

export const ImportDataModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'กรุณาเลือกไฟล์' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await importDataFromFile(selectedFile); // เรียก Logic (ไฟล์ที่ 2)
    
    setIsLoading(false);
    setMessage({ type: result.success ? 'success' : 'error', text: result.message });

    if (result.success) {
      // (ถ้าสำเร็จ ให้อยู่ใน Modal เพื่อดูข้อความ)
      // (ผู้ใช้จะกดยกเลิก/ปิด เพื่อออก)
    }
  };
  
  // [NEW] เมื่อปิด Modal ให้เคลียร์ State
  const handleClose = () => {
    setSelectedFile(null);
    setMessage(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={handleClose}
      title="นำเข้าข้อมูล (Import)"
      size="sm"
      footer={
        <div className="modal-actions--space-between">
          <div></div>
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              {message?.type === 'success' ? 'ปิด' : 'ยกเลิก'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleImport}
              disabled={isLoading || !selectedFile}
            >
              <FileArrowUp size={20} />
              {isLoading ? 'กำลังนำเข้า...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      }
    >
      <p style={{ marginBottom: '1rem' }}>
        เลือกไฟล์ .json ที่คุณสำรองไว้ (ข้อมูลปัจจุบันจะถูกเขียนทับ)
      </p>
      
      {/* (ใช้ CSS .file-upload-wrapper จาก main.css) */}
      <div className="file-upload-wrapper">
        <input
          type="file"
          id="import-file-input"
          accept=".json,application/json"
          onChange={handleFileChange}
          disabled={isLoading}
        />
        <label htmlFor="import-file-input" className="btn btn-secondary">
          {selectedFile ? selectedFile.name : 'เลือกไฟล์...'}
        </label>
      </div>

      {/* (แสดงผลลัพธ์) */}
      {message && (
        <div
          className={`form-message ${
            message.type === 'success' ? 'form-success-message' : 'form-error-message'
          }`}
          style={{ marginTop: '1rem' }}
        >
          {message.type === 'success' ? (
            <CheckCircle weight="bold" />
          ) : (
            <WarningCircle weight="bold" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </ModalBase>
  );
};