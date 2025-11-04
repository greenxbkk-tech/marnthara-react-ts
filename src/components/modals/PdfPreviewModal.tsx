// src/components/modals/PdfPreviewModal.tsx
// [NEW] Modal สำหรับแสดงตัวอย่าง PDF (ใบเสนอราคา)

import React, { useState, useEffect, useRef } from 'react';
import { useUIStore } from '../../store/uiStore';
import { ModalBase } from './ModalBase';
import { generateQuotationHtml } from '../../lib/documentGenerator';
import { Printer, X } from 'phosphor-react';
import { PDF_EXPORT_DELAY_MS } from '../../lib/config';

export const PdfPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // [NEW] เมื่อ Modal เปิด, ให้สร้าง HTML
  useEffect(() => {
    if (isOpen) {
      setHtmlContent('กำลังสร้างเอกสาร...');
      // (หน่วงเวลาเล็กน้อยเพื่อให้ State อัปเดตสมบูรณ์ - เหมือน V6)
      setTimeout(() => {
        const html = generateQuotationHtml();
        setHtmlContent(html);
      }, PDF_EXPORT_DELAY_MS);
    }
  }, [isOpen]);

  // [NEW] Handler สำหรับการพิมพ์
  const handlePrint = () => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus(); // Focus iframe
      iframe.contentWindow.print(); // Trigger print dialog
    }
  };
  
  // [NEW] CSS สำหรับ iframe (จาก main.css)
  const iframeSrcDoc = `
    <html>
      <head>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;500;700&display=swap");
          body { font-family: 'Noto Sans Thai', sans-serif; margin: 0; padding: 0; }
          .pdf-page { width: 210mm; min-height: 297mm; padding: 15mm; box-sizing: border-box; margin: 0 auto; background: #fff; }
          /* (เพิ่ม CSS ของ PDF ที่นี่ - จาก main.css) */
          /* (ตัวอย่าง) */
          .pdf-header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .shop-info { font-size: 0.8rem; text-align: right; }
          .pdf-title { text-align: center; margin: 1.5rem 0; }
          .pdf-customer { display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 0.9rem; }
          .pdf-items table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
          .pdf-items th, .pdf-items td { border: 1px solid #ccc; padding: 6px 8px; }
          .pdf-items th { background: #f0f0f0; text-align: left; }
          .pdf-items tr.room-header td { background: #f9f9f9; font-weight: bold; border-top: 2px solid #999; }
          .num { text-align: right; }
          .pdf-summary { display: flex; margin-top: 1.5rem; justify-content: space-between; align-items: flex-start; }
          .summary-notes { width: 60%; font-size: 0.8rem; }
          .baht-text { font-weight: bold; margin-top: 1rem; }
          .summary-totals { width: 38%; }
          .summary-totals table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
          .summary-totals td { padding: 8px; border-bottom: 1px solid #eee; }
          .summary-totals tr.grand-total td { font-weight: bold; font-size: 1rem; background: #f0f0f0; border-top: 2px solid #333; }
          .pdf-footer { display: flex; justify-content: space-around; text-align: center; font-size: 0.85rem; border-top: 1px solid #ccc; padding-top: 1.5rem; margin-top: 2rem; }
          @media print {
            body { margin: 0; }
            .pdf-page { margin: 0; padding: 0; border: none; }
          }
        </style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;

  return (
    <ModalBase
      isOpen={isOpen}
      onClose={onClose}
      title="ตัวอย่างใบเสนอราคา (PDF)"
      size="xxl" // [NEW] ขนาดใหญ่พิเศษ
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
      {/* (ใช้ CSS .pdf-preview-container จาก main.css) */}
      <div className="pdf-preview-container">
        <iframe
          ref={iframeRef}
          srcDoc={iframeSrcDoc}
          title="PDF Preview"
          style={{ width: '100%', height: '65vh', border: '1px solid #ccc' }}
        ></iframe>
      </div>
    </ModalBase>
  );
};