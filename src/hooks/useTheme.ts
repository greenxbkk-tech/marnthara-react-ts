// src/hooks/useTheme.ts
// [NEW] Custom Hook สำหรับจัดการ Theme (Dark/Light/System)
// (Logic ported from ui.js 'applyInitialTheme' & 'handleThemeToggle')

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
const THEME_KEY = 'marnthara.theme';

export const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. อ่านค่าจาก localStorage (เหมือน ui.js)
    return (localStorage.getItem(THEME_KEY) as Theme) || 'system';
  });

  // [NEW] Effect นี้จะทำงานเมื่อ 'theme' (state) เปลี่ยน
  useEffect(() => {
    const root = document.documentElement; // (<html>)
    
    // 2. ล้าง Class เก่า
    root.classList.remove('dark');

    // 3. ใช้ Logic เดิมจาก ui.js
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      // (ไม่ต้องทำอะไร, 'dark' ถูกลบไปแล้ว)
    } else {
      // (System)
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      }
    }

    // 4. บันทึกลง localStorage
    localStorage.setItem(THEME_KEY, theme);

  }, [theme]); // [Dependency] ทำงานใหม่ทุกครั้งที่ 'theme' เปลี่ยน

  return [theme, setTheme];
};