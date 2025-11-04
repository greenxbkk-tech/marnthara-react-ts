// src/App.tsx
// [UPDATED] เชื่อมต่อ Modals ทั้งหมดให้กลับมาทำงาน

import React from 'react';
import { Toaster } from 'react-hot-toast';

// Layouts
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { CustomerCard } from './components/CustomerCard';
import { RoomList } from './components/RoomList';

// [NEW] Import Stores
import { useUIStore } from './store/uiStore';
import { useAppStore } from './store/store';

// [NEW] Import Modals ทั้งหมด
import { DiscountModal } from './components/modals/DiscountModal';
import { AppMenuModal } from './components/modals/AppMenuModal';
import { ExportDataModal } from './components/modals/ExportDataModal';
import { ImportDataModal } from './components/modals/ImportDataModal';
import { FavoritesManagerModal } from './components/modals/FavoritesManagerModal';
import { FavoriteFormModal } from './components/modals/FavoriteFormModal';
import { ItemTypeModal } from './components/modals/ItemTypeModal';
import { PdfPreviewModal } from './components/modals/PdfPreviewModal';
import { LookbookModal } from './components/modals/LookbookModal';
import { QuickNavModal } from './components/modals/QuickNavModal';
import { ItemType } from './store/types';

function App() {
  
  // [NEW] ดึง States และ Actions จาก UI Store
  const {
    isDiscountModalOpen, closeDiscountModal,
    isAppMenuModalOpen, closeAppMenuModal,
    isExportDataModalOpen, closeExportDataModal,
    isImportDataModalOpen, closeImportDataModal,
    isFavManagerOpen, closeFavManagerModal,
    isFavFormModalOpen, closeFavFormModal,
    isItemTypeModalOpen, closeItemTypeModal, itemTypeModalContext,
    isPdfPreviewModalOpen, closePdfPreviewModal,
    isLookbookModalOpen, closeLookbookModal,
    isQuickNavModalOpen, closeQuickNavModal,
  } = useUIStore();

  // [NEW] ดึง Actions จาก App Store (สำหรับ Modal ที่ซับซ้อน)
  const addItem = useAppStore((state) => state.addItem);
  const changeItemType = useAppStore((state) => state.changeItemType);

  // [NEW] Handler ที่ซับซ้อนสำหรับ ItemTypeModal
  const handleItemTypeSelect = (newType: ItemType) => {
    if (!itemTypeModalContext) return;

    if (itemTypeModalContext.action === 'add') {
      addItem(itemTypeModalContext.roomId, newType);
    } 
    else if (itemTypeModalContext.action === 'change' && itemTypeModalContext.itemId) {
      changeItemType(itemTypeModalContext.roomId, itemTypeModalContext.itemId, newType);
    }
    // (Modal จะถูกปิดโดยอัตโนมัติจากภายใน)
  };

  return (
    <>
      {/* 1. Toast Container */}
      <Toaster />

      {/* 2. Layout: Header */}
      <AppHeader />

      {/* 3. App Container (เนื้อหาหลัก) */}
      <main id="app-container">
        <CustomerCard />
        <RoomList />
      </main>

      {/* 4. Layout: Footer */}
      <AppFooter />

      {/* 5. [NEW] Modals (วางไว้ที่นี่เพื่อให้ทำงานได้) */}
      <DiscountModal isOpen={isDiscountModalOpen} onClose={closeDiscountModal} />
      <AppMenuModal isOpen={isAppMenuModalOpen} onClose={closeAppMenuModal} />
      <ExportDataModal isOpen={isExportDataModalOpen} onClose={closeExportDataModal} />
      <ImportDataModal isOpen={isImportDataModalOpen} onClose={closeImportDataModal} />
      
      <FavoritesManagerModal isOpen={isFavManagerOpen} onClose={closeFavManagerModal} />
      <FavoriteFormModal isOpen={isFavFormModalOpen} onClose={closeFavFormModal} />
      
      <ItemTypeModal 
        isOpen={isItemTypeModalOpen} 
        onClose={closeItemTypeModal}
        onSelectType={handleItemTypeSelect}
      />
      
      <PdfPreviewModal isOpen={isPdfPreviewModalOpen} onClose={closePdfPreviewModal} />
      <LookbookModal isOpen={isLookbookModalOpen} onClose={closeLookbookModal} />
      <QuickNavModal isOpen={isQuickNavModalOpen} onClose={closeQuickNavModal} />
    </>
  );
}

export default App;