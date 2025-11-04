// src/components/modals/LookbookModal.tsx
// [NEW] Modal สำหรับแสดงสรุปภาพรวม (Lookbook)

import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { ModalBase } from './ModalBase';
import { generateLookbookHtml } from '../../lib/documentGenerator';
import { PDF_EXPORT_DELAY_MS } from '../../lib/config';
import { Printer, X } from 'phosphor-react';

export const LookbookModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  const [htmlContent, setHtmlContent] = useState('');

  // [NEW] เมื่อ Modal เปิด, ให้สร้าง HTML
  useEffect(() => {
    if (isOpen) {
      setHtmlContent('กำลังสร้างเอกสาร...');
      setTimeout(() => {
        const html = generateLookbookHtml();
        setHtmlContent(html);
      }, PDF_EXPORT_DELAY_MS);
    }
  }, [isOpen]);

  // [NEW] Handler สำหรับการพิมพ์ (ใช้ window.print ธรรมดา)
  const handlePrint = () => {
    // (สร้างหน้าต่างใหม่สำหรับพิมพ์)
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('ไม่สามารถเปิดหน้าต่างพิมพ์ได้ (อาจถูก Blocker ปิดกั้น)');
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>สรุปภาพรวม Lookbook</title>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;500;700&display=swap");
            body { font-family: 'Noto Sans Thai', sans-serif; margin: 1rem; }
            /* (เพิ่ม CSS ของ Lookbook ที่นี่ - จาก main.css) */
            .lookbook-summary { border-bottom: 2px dashed #ccc; padding-bottom: 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; }
            .lookbook-totals { text-align: right; }
            .lookbook-totals .grand-total { font-weight: bold; font-size: 1.1rem; }
            .lookbook-room h4 { background: #f4f4f4; padding: 0.5rem; margin: 1.5rem 0 1rem 0; }
            .lookbook-item .item-header { display: flex; justify-content: space-between; font-weight: bold; }
            .lookbook-item .item-body table { width: 100%; font-size: 0.9rem; margin-top: 0.25rem; }
            .lookbook-item .item-body td:first-child { width: 4rem; color: #666; }
            .lookbook-hr { border: 0; border-top: 1px solid #eee; margin: 1rem 0; }
            @media print {
              body { margin: 15mm; }
              .lookbook-summary { border-bottom: 2px solid #999; }
            }
          </style>
        </head>
        <body>
          <h2>สรุปภาพรวม (Lookbook)</h2>
          ${htmlContent}
          <script>
            window.onafterprint = () => window.close(); // ปิดอัตโนมัติหลังพิมพ์
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="สรุปภาพรวม (Lookbook)"
      size="xl" // ขนาดใหญ่
      footer={
        <div className="modal-actions--space-between">
          <div></div>
          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              <X size={20} /> ปิด
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
            >
              <Printer size={20} /> สั่งพิมพ์
            </button>
          </div>
        </div>
      }
    >
      {/* (ใช้ CSS .lookbook-preview-container จาก main.css) */}
      <div
        className="lookbook-preview-container"
        // [NEW] แสดงผล HTML โดยตรง (อันตรายถ้า HTML ไม่สะอาด, แต่เราควบคุมเอง)
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </ModalBase>
  );
};