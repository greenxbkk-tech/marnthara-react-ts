// e2e/app.spec.ts
// เทส E2E สำหรับล่า Infinite Loop และทดสอบความทนทานของระบบ

import { test, expect, Page } from '@playwright/test';

// URL ของแอป (เปลี่ยนตาม port ของคุณ)
const APP_URL = 'http://localhost:5173/';

// --- Helper Function ---
async function setupInitialData(page: Page) {
  // 1. ไปที่หน้าแอป
  await page.goto(APP_URL);

  // 2. เพิ่มห้อง
  await page.locator('button#addRoomBtn').click();
  
  // 3. เพิ่มม่านชุด
  await page.locator('button:text("เพิ่มม่านชุด")').first().click();
}

// --- Test Cases ---

test.describe('Marnthara App Stability Tests', () => {

  /**
   * [TEST 1: The Loop Hunter]
   * เทสนี้จำลองสถานการณ์ที่ทำให้เกิด Loop โดยตรง
   * 1. เปิดเมนูหลัก (ซึ่งจะเรียกใช้ useUndoRedo ที่มีปัญหา)
   * 2. ในขณะที่เมนูเปิดอยู่ (Loop ควรจะเริ่มหมุน)
   * 3. ลองพิมพ์ข้อมูลใน input อื่น (เช่น ข้อมูลลูกค้า)
   * 4. ถ้ามี Loop, Playwright จะไม่สามารถพิมพ์ได้ และจะ Time out
   */
  test('should NOT crash with infinite loop when Main Menu is open', async ({ page }) => {
    await page.goto(APP_URL);
    
    // 1. เปิดเมนูหลัก (เรียก useUndoRedo)
    await page.locator('button#menuBtn').click();
    
    // 2. ตรวจสอบว่า Modal เปิด
    const menuModal = page.locator('role=dialog[aria-labelledby="modal-title"]', { hasText: 'เมนูหลัก' });
    await expect(menuModal).toBeVisible();

    // 3. [CRITICAL STEP] พิมพ์ข้อมูลใน CustomerCard *ขณะที่เมนูยังเปิดอยู่*
    // ถ้าแอปค้าง (Infinite Loop) คำสั่ง .fill() นี้จะล้มเหลว (Timeout)
    const customerNameInput = page.locator('input[name="customer_name"]');
    await customerNameInput.fill('Test Customer');
    
    // 4. [ASSERTION]
    // ถ้าโค้ดมาถึงตรงนี้ได้ แปลว่าแอปไม่ค้าง
    await expect(customerNameInput).toHaveValue('Test Customer');
    
    // 5. ปิด Modal
    await page.locator('button[aria-label="ปิด"]').first().click();
    await expect(menuModal).not.toBeVisible();
  });


  /**
   * [TEST 2: The Accountant Stress Test]
   * เทสนี้ทดสอบ "นักบัญชี" (_recalculateTotals) อย่างหนักหน่วง
   * 1. สร้าง Item
   * 2. กรอกข้อมูล W, H, Price เพื่อกระตุ้น _recalculateTotals
   * 3. ตรวจสอบว่ายอดรวม (Footer) อัปเดตถูกต้อง
   * 4. ทำซ้ำ (Duplicate) Item เพื่อกระตุ้น _recalculateTotals อีกครั้ง
   * 5. ตรวจสอบว่ายอดรวมอัปเดตถูกต้องอีกครั้ง
   */
  test('should correctly handle rapid recalculations (Accountant Stress Test)', async ({ page }) => {
    await setupInitialData(page);

    // 2. กรอกข้อมูล
    await page.locator('input[name="width_m"]').first().fill('2.5');
    await page.locator('input[name="height_m"]').first().fill('3.0');
    // (รอให้ onBlur ทำงาน)
    
    // (เนื่องจาก logic การคำนวณซับซ้อน เราจะกรอกราคาที่ง่าย)
    // ให้กรอกราคาหลุยส์ (ซึ่งคำนวณง่าย: W * Price)
    await page.locator('select[name="set_style"]').first().selectOption('หลุยส์');
    await page.locator('input[name="louis_price_per_m"]').first().fill('1000');
    // W (2.5) * Price (1000) = 2500 (บวกค่าอื่นๆ เล็กน้อย)

    // 3. ตรวจสอบยอดรวมที่ Footer
    const grandTotal = page.locator('#discountBtn .totals-row.grand .value');
    
    // รอให้ยอดรวมอัปเดต (ไม่ใช่ 0.00)
    await expect(grandTotal).not.toHaveText('0.00');
    
    // (ดึงค่ามาตรวจสอบคร่าวๆ)
    const totalText1 = await grandTotal.innerText();
    const totalValue1 = parseFloat(totalText1.replace(/,/g, ''));
    expect(totalValue1).toBeGreaterThan(2500); // ต้องมากกว่า 2500

    // 4. ทำซ้ำ (Duplicate) Item
    await page.locator('button[title="คัดลอกรายการ"]').first().click();
    
    // 5. [ASSERTION]
    // ยอดรวมควรอัปเดตเป็น 2 เท่า (โดยประมาณ)
    // เราใช้ .toContainText แทนการคำนวณเป๊ะๆ เพื่อความทนทานของเทส
    const expectedTotal2Text = (totalValue1 * 2).toLocaleString('th-TH', { minimumFractionDigits: 2 });
    
    // รอให้ยอดรวมอัปเดตเป็นค่าใหม่
    await expect(grandTotal).toHaveText(expectedTotal2Text);
    
    // ตรวจสอบว่าแอปยังตอบสนอง
    await page.locator('input[name="customer_phone"]').fill('999');
    await expect(page.locator('input[name="customer_phone"]')).toHaveValue('999');
  });

});