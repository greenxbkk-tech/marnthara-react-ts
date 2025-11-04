// src/components/modals/AppMenuModal.tsx
// [FIXED] แก้ไข Typo (phosphR-react -> phosphor-react)

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { ModalBase } from './ModalBase';
import {
  FilePdf, Eye,
  Warning, FileArrowUp, FileArrowDown, Heart, ArrowUUpLeft, ArrowUUpRight
} from 'phosphor-react'; // <-- [FIXED] แก้ไข Typo ที่นี่

interface AppMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppMenuModal: React.FC<AppMenuModalProps> = ({ isOpen, onClose }) => {
  // [FIXED] hook นี้ถูกแก้ไขแล้ว ไม่สร้าง Loop
  const { undo, redo, canUndo, canRedo, clearHistory } = useUndoRedo();
  
  // [FIXED] ดึง Action แบบ Atomic ( "นิ่ง" เสมอ)
  const resetState = useAppStore((state) => state.resetState);
  
  // [FIXED] ดึง Actions ทั้งหมดจาก uiStore แบบ Atomic
  const openFavManagerModal = useUIStore((state) => state.openFavManagerModal);
  const openImportDataModal = useUIStore((state) => state.openImportDataModal);
  const openExportDataModal = useUIStore((state) => state.openExportDataModal);
  const openPdfPreviewModal = useUIStore((state) => state.openPdfPreviewModal);
  const openLookbookModal = useUIStore((state) => state.openLookbookModal);

  const handleManageFavorites = () => { openFavManagerModal(); onClose(); };
  const handleImport = () => { openImportDataModal(); onClose(); };
  const handleExport = () => { openExportDataModal(); onClose(); };
  
  const handleReset = () => { 
    resetState(); 
    onClose(); 
  };

  const handleExportPDF = () => {
    openPdfPreviewModal();
    onClose();
  };
  const handleExportLookbook = () => {
    openLookbookModal();
    onClose();
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="เมนูหลัก" size="md">
      <div className="main-menu-grid">
        
        {/* --- Undo/Redo --- */}
        <button type="button" className="btn btn-menu" onClick={undo} disabled={!canUndo}>
          <ArrowUUpLeft size={24} /> Undo
        </button>
        <button type="button" className="btn btn-menu" onClick={redo} disabled={!canRedo}>
          <ArrowUUpRight size={24} /> Redo
        </button>

        {/* --- Favorites --- */}
        <button type="button" className="btn btn-menu" onClick={handleManageFavorites}>
          <Heart size={24} /> จัดการโปรด
        </button>

        {/* --- Export --- */}
        <button type="button" className="btn btn-menu" onClick={handleExportPDF}>
          <FilePdf size={24} /> ส่งออก PDF
        </button>
        <button type="button" className="btn btn-menu" onClick={handleExportLookbook}>
          <Eye size={24} /> ส่งออก Lookbook
        </button>

        {/* --- Data --- */}
        <button type="button" className="btn btn-menu" onClick={handleImport}>
          <FileArrowUp size={24} /> นำเข้าข้อมูล
        </button>
        <button type="button" className="btn btn-menu" onClick={handleExport}>
          <FileArrowDown size={24} /> สำรองข้อมูล
        </button>
        
        {/* --- Reset --- */}
        <button type="button" className="btn btn-menu btn-menu-danger" onClick={handleReset}>
          <Warning size={24} /> รีเซ็ตข้อมูล
        </button>

      </div>
    </ModalBase>
  );
};