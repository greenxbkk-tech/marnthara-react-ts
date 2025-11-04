module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime', // <-- เพิ่มสำหรับ React 18
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // <-- จัดการ conflict กับ Prettier
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'vite.config.ts',
    'playwright.config.ts',
    'eslint.config.js', // <-- เพิ่มไฟล์ที่ขัดแย้งกัน
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'prettier'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'prettier/prettier': 'error', // <-- ทำให้ Prettier เป็น error
    '@typescript-eslint/no-explicit-any': 'warn', // <-- ลดความเข้มงวดของ any
    'react/prop-types': 'off', // <-- ปิดการ check prop-types (เราใช้ TS)
  },
  settings: {
    react: {
      version: 'detect', // <-- ตรวจจับเวอร์ชัน React อัตโนมัติ
    },
  },
};