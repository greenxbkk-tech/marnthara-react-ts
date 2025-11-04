// src/App.tsx
// [UPDATED] เพิ่ม <Toaster /> (Container สำหรับ Toast)

import React from 'react';
import { useUIStore } from './store/uiStore';
import { Toaster } from 'react-hot-toast'; // [NEW] Import

// (Imports: Layouts, Modals...)
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { CustomerCard } from './components/CustomerCard';
import { RoomList } from './components/RoomList';
// ... (Import Modals ทั้งหมด)

function App() {
  // ... (โค้ด store และ handlers เดิม) ...
  const { /* ... (Modal states) ... */ } = useUIStore();
  // ... (handleItemTypeSelect handler) ...

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
      {/* ... (Render Modals ทั้งหมด) ... */}
    </>
  );
}

export default App;