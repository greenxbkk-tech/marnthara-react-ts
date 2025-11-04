// src/components/modals/AppMenuModal.tsx
// [UPDATED] เชื่อมปุ่ม 'PDF' และ 'Lookbook'

import React from 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { ModalBase } from './ModalBase';
import {
  // ... (Icons)
  FilePdf, Eye, // (Icons)
  Warning, FileArrowUp, FileArrowDown, Heart, ArrowUUpLeft, ArrowUUpRight
} from 'phosphor-react';

interface AppMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppMenuModal: React.FC<AppMenuModalProps> = ({ isOpen, onClose }) => {
  const { undo, redo, canUndo, canRedo, clearHistory } = useUndoRedo();
  const resetState = useAppStore((state) => state.resetState);
  
  // [NEW] ดึง Actions จาก uiStore
  const {
    openFavManagerModal,
    openImportDataModal,
    openExportDataModal,
    openPdfPreviewModal, // [NEW]
    openLookbookModal,   // [NEW]
  } = useUIStore((state) => ({
    openFavManagerModal: state.openFavManagerModal,
    openImportDataModal: state.openImportDataModal,
    openExportDataModal: state.openExportDataModal,
    openPdfPreviewModal: state.openPdfPreviewModal, // [NEW]
    openLookbookModal: state.openLookbookModal,     // [NEW]
  }));

  const handleManageFavorites = () => { openFavManagerModal(); onClose(); };
  const handleImport = () => { openImportDataModal(); onClose(); };
  const handleExport = () => { openExportDataModal(); onClose(); };
  const handleReset = () => { /* ... (โค้ดเดิม) ... */ };

  // [UPDATED] Handlers
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
        {/* ... (Undo/Redo, Favorites) ... */}

        {/* --- Export --- */}
        <button type="button" className="btn btn-menu" onClick={handleExportPDF}>
          <FilePdf size={24} /> ส่งออก PDF
        </button>
        <button type="button" className="btn btn-menu" onClick={handleExportLookbook}>
          <Eye size={24} /> ส่งออก Lookbook
        </button>

        {/* ... (Import/Export Data, Reset) ... */}
      </div>
    </ModalBase>
  );
};