// src/store/uiStore.ts
// [UPDATED] เพิ่ม State สำหรับ QuickNavModal

import { create } from 'zustand';
// [FIXED] เปลี่ยน 'import' เป็น 'import type' เพราะมันเป็น Interface
import type { ItemType, FavoritesData } from './types';

// ... (Contexts: ItemTypeModalContext, FavFormModalContext ... ไม่เปลี่ยนแปลง) ...
export type ItemTypeModalContext = { action: 'add' | 'change'; roomId: string; itemId?: string; } | null;
export type FavFormModalContext = { mode: 'add' | 'edit'; type: keyof FavoritesData; code?: string; price?: number; } | null;

interface UIState {
  // (Modal States เดิม)
  isDiscountModalOpen: boolean;
  isItemTypeModalOpen: boolean;
  itemTypeModalContext: ItemTypeModalContext;
  isAppMenuModalOpen: boolean;
  isFavManagerOpen: boolean;
  isFavFormModalOpen: boolean;
  favFormModalContext: FavFormModalContext;
  isExportDataModalOpen: boolean;
  isImportDataModalOpen: boolean;
  isPdfPreviewModalOpen: boolean;
  isLookbookModalOpen: boolean;
  isQuickNavModalOpen: boolean;

  // (Actions เดิม)
  openDiscountModal: () => void;
  closeDiscountModal: () => void;
  openItemTypeModal: (context: ItemTypeModalContext) => void;
  closeItemTypeModal: () => void;
  openAppMenuModal: () => void;
  closeAppMenuModal: () => void;
  openFavManagerModal: () => void;
  closeFavManagerModal: () => void;
  openFavFormModal: (context: FavFormModalContext) => void;
  closeFavFormModal: () => void;
  openExportDataModal: () => void;
  closeExportDataModal: () => void;
  openImportDataModal: () => void;
  closeImportDataModal: () => void;
  openPdfPreviewModal: () => void;
  closePdfPreviewModal: () => void;
  openLookbookModal: () => void;
  closeLookbookModal: () => void;
  openQuickNavModal: () => void;
  closeQuickNavModal: () => void;

  closeAllModals: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // (Default State เดิม)
  isDiscountModalOpen: false,
  isItemTypeModalOpen: false,
  itemTypeModalContext: null,
  isAppMenuModalOpen: false,
  isFavManagerOpen: false,
  isFavFormModalOpen: false,
  favFormModalContext: null,
  isExportDataModalOpen: false,
  isImportDataModalOpen: false,
  isPdfPreviewModalOpen: false,
  isLookbookModalOpen: false,
  isQuickNavModalOpen: false,

  // (Actions เดิม)
  openDiscountModal: () => set({ isDiscountModalOpen: true }),
  closeDiscountModal: () => set({ isDiscountModalOpen: false }),
  openItemTypeModal: (context) => set({ isItemTypeModalOpen: true, itemTypeModalContext: context }),
  closeItemTypeModal: () => set({ isItemTypeModalOpen: false, itemTypeModalContext: null }),
  openAppMenuModal: () => set({ isAppMenuModalOpen: true }),
  closeAppMenuModal: () => set({ isAppMenuModalOpen: false }),
  openFavManagerModal: () => set({ isFavManagerOpen: true }),
  closeFavManagerModal: () => set({ isFavManagerOpen: false }),
  openFavFormModal: (context) => set({ isFavFormModalOpen: true, favFormModalContext: context }),
  closeFavFormModal: () => set({ isFavFormModalOpen: false, favFormModalContext: null }),
  openExportDataModal: () => set({ isExportDataModalOpen: true }),
  closeExportDataModal: () => set({ isExportDataModalOpen: false }),
  openImportDataModal: () => set({ isImportDataModalOpen: true }),
  closeImportDataModal: () => set({ isImportDataModalOpen: false }),
  openPdfPreviewModal: () => set({ isPdfPreviewModalOpen: true }),
  closePdfPreviewModal: () => set({ isPdfPreviewModalOpen: false }),
  openLookbookModal: () => set({ isLookbookModalOpen: true }),
  closeLookbookModal: () => set({ isLookbookModalOpen: false }),
  openQuickNavModal: () => set({ isQuickNavModalOpen: true }),
  closeQuickNavModal: () => set({ isQuickNavModalOpen: false }),

  closeAllModals: () => set({
    // (ปิด Modals ทั้งหมด)
    isDiscountModalOpen: false, isItemTypeModalOpen: false, isAppMenuModalOpen: false,
    isFavManagerOpen: false, isFavFormModalOpen: false,
    isExportDataModalOpen: false, isImportDataModalOpen: false,
    isPdfPreviewModalOpen: false, isLookbookModalOpen: false,
    isQuickNavModalOpen: false,
    itemTypeModalContext: null, favFormModalContext: null,
  }),
}));