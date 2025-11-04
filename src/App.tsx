// src/App.tsx
// Fixed: removed git conflict markers and literal "...".
// Connected top-level UI pieces and modals with stable handlers.

import React from 'react';
import { Toaster } from 'react-hot-toast';

// Layouts / Components
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { CustomerCard } from './components/CustomerCard';
import { RoomList } from './components/RoomList';

// Modals (expected to exist in the project)
import { ItemTypeModal } from './components/modals/ItemTypeModal';
import { PdfPreviewModal } from './components/modals/PdfPreviewModal';
import { LookbookModal } from './components/modals/LookbookModal';
import { QuickNavModal } from './components/modals/QuickNavModal';

// Stores
import { useUIStore } from './store/uiStore';
import { useAppStore } from './store/store';

export function App(): JSX.Element {
  // UI store: modal open states + actions
  const {
    isItemTypeModalOpen,
    isPdfPreviewModalOpen,
    isLookbookModalOpen,
    isQuickNavModalOpen,
    openItemTypeModal,
    closeItemTypeModal,
    openPdfPreviewModal,
    closePdfPreviewModal,
    openLookbookModal,
    closeLookbookModal,
    openQuickNavModal,
    closeQuickNavModal,
  } = useUIStore((s) => ({
    isItemTypeModalOpen: s.isItemTypeModalOpen,
    isPdfPreviewModalOpen: s.isPdfPreviewModalOpen,
    isLookbookModalOpen: s.isLookbookModalOpen,
    isQuickNavModalOpen: s.isQuickNavModalOpen,
    openItemTypeModal: s.openItemTypeModal,
    closeItemTypeModal: s.closeItemTypeModal,
    openPdfPreviewModal: s.openPdfPreviewModal,
    closePdfPreviewModal: s.closePdfPreviewModal,
    openLookbookModal: s.openLookbookModal,
    closeLookbookModal: s.closeLookbookModal,
    openQuickNavModal: s.openQuickNavModal,
    closeQuickNavModal: s.closeQuickNavModal,
  }));

  // App store: example actions used by modals/handlers
  const { addRoom, addItem, rooms } = useAppStore((s) => ({
    addRoom: s.addRoom,
    addItem: s.addItem,
    rooms: s.rooms,
  }));

  // Example: open item-type modal for a specific room
  const handleOpenItemTypeForRoom = (roomId?: string) => {
    // store may keep a focusedRoomId in UI store in real app
    openItemTypeModal();
    // you can set focused room id in UI store if implemented
    // e.g. setFocusedRoom(roomId)
  };

  const handleItemTypeSelect = (type: string) => {
    // Add item to first room as fallback
    const targetRoomId = rooms?.[0]?.id;
    if (!targetRoomId) {
      // create a room then add
      addRoom();
      const newRoomId = useAppStore.getState().rooms.slice(-1)[0]?.id;
      if (newRoomId) {
        addItem(newRoomId, type as any);
      }
    } else {
      addItem(targetRoomId, type as any);
    }
    closeItemTypeModal();
  };

  // Handlers for PDF / Lookbook / QuickNav modals simply close
  const handleClosePdfPreview = () => closePdfPreviewModal();
  const handleCloseLookbook = () => closeLookbookModal();
  const handleCloseQuickNav = () => closeQuickNavModal();

  return (
    <>
      {/* 1. Toast container (top-level) */}
      <Toaster position="top-right" />

      {/* 2. App chrome */}
      <AppHeader
        onOpenQuickNav={() => openQuickNavModal()}
        onOpenLookbook={() => openLookbookModal()}
      />

      <main className="app-main container">
        {/* Customer summary / editor */}
        <CustomerCard />

        {/* Rooms and items */}
        <RoomList onOpenItemType={(roomId?: string) => handleOpenItemTypeForRoom(roomId)} />
      </main>

      <AppFooter
        onOpenPdfPreview={() => openPdfPreviewModal()}
        onOpenItemType={() => openItemTypeModal()}
      />

      {/* Modals (controlled) */}
      <ItemTypeModal
        isOpen={Boolean(isItemTypeModalOpen)}
        onClose={closeItemTypeModal}
        onSelectType={(type) => handleItemTypeSelect(type)}
      />

      <PdfPreviewModal isOpen={Boolean(isPdfPreviewModalOpen)} onClose={handleClosePdfPreview} />

      <LookbookModal isOpen={Boolean(isLookbookModalOpen)} onClose={handleCloseLookbook} />

      <QuickNavModal isOpen={Boolean(isQuickNavModalOpen)} onClose={handleCloseQuickNav} />
    </>
  );
}

export default App;
