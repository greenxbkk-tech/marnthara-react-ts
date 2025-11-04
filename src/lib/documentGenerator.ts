// src/lib/documentGenerator.ts
// [NEW] Ported from documentGenerator.js to TypeScript
// สร้าง HTML String สำหรับ PDF และ Lookbook

import { useAppStore } from '../store/store';
import { AppPayload, ItemData, SetItemData, WallpaperItemData, AreaBasedItemData } from '../store/types';
import { SHOP_CONFIG, ITEM_CONFIG, PRICING, WALLPAPER_SPECS } from './config';
import { bahttext, fmt, fmtTH, sanitizeHTML, toNum } from './utils';
import { CALC, PriceResult, SummaryTotals } from './calculations';

/**
 * [HELPER] สร้างชื่อที่แสดงผลสำหรับ Item
 */
const getItemDisplayName = (item: ItemData): string => {
  const baseName = ITEM_CONFIG[item.type]?.name || 'รายการ';
  if (item.type === 'set' && item.set_style === 'หลุยส์') {
    return 'ม่านหลุยส์';
  }
  return baseName;
};

/**
 * [HELPER] สร้างรายละเอียดสเปคสำหรับ Lookbook
 */
const getLookbookSpecHtml = (item: ItemData): string => {
  let specs: string[] = [];

  switch (item.type) {
    case 'set':
      specs.push(`สไตล์: ${item.set_style} (ลอน ${item.fabric_variant})`);
      if (item.fabric_code) specs.push(`ผ้าทึบ: ${sanitizeHTML(item.fabric_code)}`);
      if (item.sheer_fabric_code) specs.push(`ผ้าโปร่ง: ${sanitizeHTML(item.sheer_fabric_code)}`);
      if (item.set_style === 'หลุยส์' && item.louis_valance) {
         specs.push(`เชิงหลุยส์: ${sanitizeHTML(item.louis_valance)}`);
      }
      break;
    case 'wallpaper':
      if (item.code) specs.push(`รหัส: ${sanitizeHTML(item.code)}`);
      specs.push(`ผนัง: ${item.widths.map(w => fmt(w)).join(' + ')} ม.`);
      break;
    case 'wooden_blind':
    case 'roller_blind':
    case 'vertical_blind':
    case 'aluminum_blind':
      if (item.code) specs.push(`รหัส/สี: ${sanitizeHTML(item.code)}`);
      if (item.adjustment_side) specs.push(`ด้านปรับ: ${item.adjustment_side}`);
      break;
    case 'partition':
    case 'pleated_screen':
      if (item.code) specs.push(`รหัส/สี: ${sanitizeHTML(item.code)}`);
      if (item.opening_style) specs.push(`การเปิด: ${item.opening_style}`);
      break;
  }
  return specs.join(' | ');
};


/**
 * [NEW] Function หลักที่ดึง State และสร้างข้อมูล
 */
const getPayloadAndTotals = (): { payload: AppPayload; totals: SummaryTotals } => {
  const state = useAppStore.getState();
  const payload: AppPayload = {
    app_version: state.app_version,
    customer_name: state.customer_name,
    customer_phone: state.customer_phone,
    customer_address: state.customer_address,
    customer_card_open: state.customer_card_open,
    discount: state.discount,
    rooms: state.rooms,
    favorites: state.favorites,
  };
  const totals = CALC.calculateSummaryTotals(payload.rooms, payload.discount);
  return { payload, totals };
};

// ----------------------------------------------------
// --- EXPORT 1: ใบเสนอราคา (Quotation) ---
// ----------------------------------------------------

export const generateQuotationHtml = (): string => {
  const { payload, totals } = getPayloadAndTotals();
  const { subTotal, discountAmount, grandTotal } = totals;
  const date = new Date().toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // --- สร้างตารางรายการ ---
  const tableRows = payload.rooms.flatMap(room => {
    if (room.is_suspended) return [];

    const roomHeaderRow = `
      <tr class="room-header">
        <td colspan="5"><strong>${sanitizeHTML(room.room_name) || 'ห้อง (ไม่ระบุ)'}</strong></td>
      </tr>`;
    
    const itemRows = room.items.map((item, index) => {
      if (item.is_suspended) return '';
      
      const result = CALC.calculateItemPrice(item);
      if (result.total <= 0) return '';
      
      const qtyStr = `${fmt(item.width_m)} x ${fmt(item.height_m)}`;
      const unit = (item.type === 'wallpaper') ? 'ม้วน' : 'ชุด';
      const qty = (item.type === 'wallpaper') ? (result.rolls || 0) : 1;
      const pricePerUnit = (qty > 0) ? (result.total / qty) : 0;

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${getItemDisplayName(item)} (${sanitizeHTML(item.notes || '')})</td>
          <td>${qtyStr}</td>
          <td class="num">${qty} ${unit}</td>
          <td class="num">${fmtTH(result.total)}</td>
        </tr>`;
    }).join('');

    return [roomHeaderRow, itemRows];
  }).join('');

  if (!tableRows.trim()) {
    return `<p class="empty-summary">ไม่มีรายการสำหรับสร้างใบเสนอราคา</p>`;
  }

  // --- สร้าง HTML ทั้งหมด ---
  return `
    <div class="pdf-page">
      <header class="pdf-header">
        <div class="shop-logo">
          ${SHOP_CONFIG.logoUrl ? `<img src="${SHOP_CONFIG.logoUrl}" alt="Logo">` : ''}
        </div>
        <div class="shop-info">
          <strong>${sanitizeHTML(SHOP_CONFIG.name)}</strong><br>
          เลขประจำตัวผู้เสียภาษี: ${sanitizeHTML(SHOP_CONFIG.taxId)}<br>
          ${sanitizeHTML(SHOP_CONFIG.address)}<br>
          โทร: ${sanitizeHTML(SHOP_CONFIG.phone)}
        </div>
      </header>

      <section class="pdf-title">
        <h2>ใบเสนอราคา</h2>
        <span>(ต้นฉบับ)</span>
      </section>

      <section class="pdf-customer">
        <div class="customer-info">
          <strong>ลูกค้า:</strong> ${sanitizeHTML(payload.customer_name) || '-'}<br>
          <strong>โทร:</strong> ${sanitizeHTML(payload.customer_phone) || '-'}<br>
          <strong>ที่อยู่:</strong> ${sanitizeHTML(payload.customer_address || '-').replace(/\n/g, '<br>')}<br>
        </div>
        <div class="doc-info">
          <strong>เลขที่:</strong> -<br>
          <strong>วันที่:</strong> ${date}<br>
        </div>
      </section>

      <section class="pdf-items">
        <table>
          <thead>
            <tr>
              <th style="width: 5%;">#</th>
              <th style="width: 45%;">รายการ</th>
              <th style="width: 15%;">ขนาด (ม.)</th>
              <th style="width: 15%;" class="num">จำนวน</th>
              <th style="width: 20%;" class="num">ราคารวม (บาท)</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </section>

      <section class="pdf-summary">
        <div class="summary-notes">
          <strong>หมายเหตุ:</strong>
          <ul>
            ${SHOP_CONFIG.pdf.notes.map(n => `<li>${sanitizeHTML(n)}</li>`).join('')}
          </ul>
          <div class="baht-text">
            <strong>( ${bahttext(grandTotal)} )</strong>
          </div>
        </div>
        <div class="summary-totals">
          <table>
            <tr>
              <td>รวมเป็นเงิน</td>
              <td class="num">${fmtTH(subTotal)}</td>
            </tr>
            <tr>
              <td>ส่วนลด</td>
              <td class="num">${fmtTH(discountAmount)}</td>
            </tr>
            <tr class="grand-total">
              <td>ยอดสุทธิ</td>
              <td class="num">${fmtTH(grandTotal)}</td>
            </tr>
          </table>
        </div>
      </section>

      <footer class="pdf-footer">
        <div class="footer-col">
          <strong>${SHOP_CONFIG.pdf.paymentTerms}</strong><br>
          ราคานี้ยืนยัน ${SHOP_CONFIG.pdf.priceValidity}
        </div>
        <div class="footer-col" style="text-align: center;">
          <br>...................................<br>(ผู้เสนอราคา)
        </div>
        <div class="footer-col" style="text-align: center;">
          <br>...................................<br>(ลูกค้า/ผู้อนุมัติ)
        </div>
      </footer>
    </div>
  `;
};


// ----------------------------------------------------
// --- EXPORT 2: สรุปภาพรวม (Lookbook) ---
// ----------------------------------------------------

export const generateLookbookHtml = (): string => {
  const { payload, totals } = getPayloadAndTotals();
  const { subTotal, discountAmount, grandTotal } = totals;
  let hasPricedItems = false;
  
  const roomsHtml = payload.rooms.map(room => {
    if (room.is_suspended) return '';

    const itemsHtml = room.items.map((item, index) => {
      if (item.is_suspended) return '';
      
      const result = CALC.calculateItemPrice(item);
      if (result.total <= 0) return '';
      
      hasPricedItems = true;
      const specHtml = getLookbookSpecHtml(item);
      
      return `
        <div class="lookbook-item" data-room-id="${room.id}" data-item-index="${index}">
          <div class="item-header">
            <strong>${index + 1}. ${getItemDisplayName(item)}</strong>
            <span class="price">${fmtTH(result.total)} บาท</span>
          </div>
          <div class="item-body">
            <table>
              <tr><td>ขนาด</td><td>${fmt(item.width_m)} x ${fmt(item.height_m)} ม.</td></tr>
              ${specHtml ? `<tr><td>สเปค</td><td>${specHtml}</td></tr>` : ''}
              ${item.notes ? `<tr><td>โน้ต</td><td>${sanitizeHTML(item.notes)}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `;
    }).join('<hr class="lookbook-hr">');

    if (!itemsHtml.trim()) return '';

    return `
      <div class="lookbook-room">
        <h4><i class="ph ph-map-pin"></i> ${sanitizeHTML(room.room_name) || 'ไม่ระบุชื่อห้อง'}</h4>
        ${itemsHtml}
      </div>
    `;
  }).join('');

  if (!hasPricedItems) {
    return `<p class="empty-summary">ไม่มีรายการสำหรับสร้างรายงาน</p>`;
  }

  // --- สร้าง HTML ทั้งหมด ---
  return `
    <div class="lookbook-summary">
      <div class="lookbook-customer-info">
        <strong>ลูกค้า:</strong> ${sanitizeHTML(payload.customer_name) || '-'}<br/>
        <strong>ที่อยู่:</strong> ${sanitizeHTML(payload.customer_address || '-').replace(/\n/g, '<br/>')}
      </div>
      <div class="lookbook-totals">
        <span>ยอดรวม (ก่อนส่วนลด): ${fmtTH(subTotal)} บาท</span>
        ${discountAmount > 0 ? `<span>ส่วนลด: -${fmtTH(discountAmount)} บาท</span>` : ''}
        <span class="grand-total">ยอดสุทธิ: ${fmtTH(grandTotal)} บาท</span>
      </div>
    </div>
    <div class="lookbook-rooms-container">
      ${roomsHtml}
    </div>
  `;
};