import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // (เหมือนไฟล์เก่าของคุณ) ตั้งค่า base path สำหรับ GitHub Pages
  base: './',

  // (เหมือนไฟล์เก่าของคุณ) ตั้งค่า Vitest (Unit Test)
  test: {
    environment: 'jsdom',
    // [สำคัญ] บอก Unit Test (Vitest) ไม่ให้ยุ่งกับ E2E Test (Playwright)
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
  },
});