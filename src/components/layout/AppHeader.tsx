// src/components/layout/AppHeader.tsx
// [UPDATED] เชื่อมปุ่ม 'Theme' ให้ทำงานจริง

import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useTheme } from '../../hooks/useTheme'; // [NEW]
import { PhosphorLogo, Moon, Sun, List } from 'phosphor-react';

// [UPDATED] Theme Toggle Button (ไม่ใช่ Placeholder แล้ว)
const ThemeToggleButton: React.FC = () => {
  // [NEW] ใช้ Hook (ไฟล์ที่ 2)
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    // (Logic: light -> dark -> system -> light)
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      className="btn-icon"
      title={`เปลี่ยนธีม (ปัจจุบัน: ${theme})`}
      onClick={toggleTheme}
    >
      {/* [NEW] แสดง Icon ตาม Theme */}
      {theme === 'dark' ? (
        <Sun size={24} weight="bold" />
      ) : (
        <Moon size={24} weight="bold" />
      )}
    </button>
  );
};

// (AppMenuButton ... ไม่เปลี่ยนแปลง)
const AppMenuButton: React.FC = () => {
  const openAppMenuModal = useUIStore((state) => state.openAppMenuModal);
  return (
    <button className="btn btn-secondary" id="menuBtn" onClick={openAppMenuModal}>
      <List size={20} weight="bold" />
      <span>เมนู</span>
    </button>
  );
};

export const AppHeader: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-title-group">
        <PhosphorLogo size={32} weight="bold" color="var(--primary)" />
        <h1>Marnthara (React)</h1>
      </div>
      <div className="header-actions">
        <ThemeToggleButton /> {/* [UPDATED] */}
        <AppMenuButton />
      </div>
    </header>
  );
};