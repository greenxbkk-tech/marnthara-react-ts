// tests/example.spec.ts
// [NEW] ไฟล์ทดสอบ E2E แรกของเรา

import { test, expect } from '@playwright/test';

// (ตั้งค่าให้เทสที่ Localhost ของเรา)
test.use({ baseURL: 'http://localhost:5173' });

test('1. App should load and show customer card', async ({ page }) => {
  // 1. ไปที่หน้าแอป
  await page.goto('/');

  // 2. ตรวจสอบว่า Title ถูกต้อง (จาก index.html)
  await expect(page).toHaveTitle(/Marnthara React/);

  // 3. ตรวจสอบว่า Header (H1) แสดงถูกต้อง (จาก AppHeader.tsx)
  await expect(page.getByRole('heading', { name: 'Marnthara (React)' })).toBeVisible();

  // 4. ตรวจสอบว่า CustomerCard (H2) แสดงถูกต้อง (จาก CustomerCard.tsx)
  await expect(page.getByRole('heading', { name: 'ข้อมูลลูกค้า' })).toBeVisible();
});

test('2. User can add a new Room and a new Item', async ({ page }) => {
  await page.goto('/');

  // 1. คลิกปุ่ม "เพิ่มห้อง" (จาก RoomList.tsx / App.tsx)
  // (เราใช้ 'getByRole' เพราะมันเสถียรที่สุด)
  await page.getByRole('button', { name: 'เพิ่มห้อง' }).click();

  // 2. ตรวจสอบว่ามี "ห้องใหม่" 2 ห้อง (ห้อง 1 (เดิม) และ ห้อง 2 (ใหม่))
  // (เราใช้ 'getByText' เพื่อหาข้อความ)
  await expect(page.getByText('ห้องใหม่', { exact: true })).toHaveCount(2);

  // 3. หาม่านชุด (ปุ่มแรกในแถบ footer ของห้อง)
  const addSetButton = page.getByRole('button', { name: 'เพิ่มม่านชุด' }).first();

  // 4. คลิกปุ่ม "เพิ่มม่านชุด"
  await addSetButton.click();

  // 5. ตรวจสอบว่า Item Card ใหม่ โผล่ขึ้นมา
  // (โดยการตรวจสอบว่ามี label "ราคาผ้าทึบ" แสดงผล)
  await expect(page.getByLabel('ราคาผ้าทึบ (บาท/หลา)')).toBeVisible();
});