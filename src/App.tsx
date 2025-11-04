// src/App.tsx
// [UPDATED] เพิ่ม <Toaster /> (Container สำหรับ Toast)
// NOTE: Removed subscription to entire uiStore to avoid unnecessary re-renders.

import React from 'react';
import { Toaster } from 'react-hot-toast'; // [NEW] Import
// (Imports: Layouts, Modals...)
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { CustomerCard } from './components/CustomerCard';
import { RoomList } from './components/RoomList';
// ... (Import Modals ทั้งหมด)

/**
 * Important change:
 * - Do NOT destructure the whole uiStore here (e.g. `const { ... } = useUIStore()`).
 *   That subscribes App to the entire UI store and may cause unnecessary re-renders / loops.
 * - Individual components or modals should select only the state/actions they need.
 */
function App() {
  // Removed: const { /* ... (Modal states) ... */ } = useUIStore();
  // (handleItemTypeSelect handler) ...

  return (
    <>
      {/* [NEW] 1. Toast Container (วางไว้บนสุด) */}
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

      {/* 5. Modals */}
      {/* ... (Render Modals ทั้งหมด — let each modal use selectors to read its own flags/actions) */}
    </>
  );
}

export default App;