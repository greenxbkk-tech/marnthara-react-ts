import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // [NEW] ต้อง Import 'path' เพื่อใช้ในการ Resolve

// https://vitejs.dev/config/
export default defineConfig({
  // [CRITICAL FIX] แก้ปัญหาการ Resolve Path
  // เราต้อง force Vite ให้ Pre-bundle ทั้ง 'zustand/middleware' และ 'zundo'
  optimizeDeps: {
    include: ['zustand/middleware', 'zundo'],
  },

  plugins: [react()],

  // (การตั้งค่าเดิม)
  base: './',

  test: {
    environment: 'jsdom',
    exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
  },
});