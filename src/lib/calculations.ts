// src/lib/calculations.ts
// [REFACTORED] แปลง calculations.js เป็น TypeScript
// เอนจิ้นการคำนวณราคาทั้งหมด (Pure Logic)

// [FIXED] ลบ 'SQM_TO_SQYD' ออกจาก import นี้
import { PRICING, WALLPAPER_SPECS } from './config';
import { toNum } from './utils';
import type {
  SetItemData,
  WallpaperItemData,
  AreaBasedItemData,
  ItemData,
  DiscountData,
  RoomData,
} from '../store/types';

/**
 * Interface สำหรับผลลัพธ์การคำนวณราคา
 */
export interface PriceResult {
  total: number; // ราคาสุทธิของรายการนี้
  // Optional details
  fabric?: number;
  sheer?: number;
  louis?: number;
  sewing?: number;
  hardware?: number;
  install?: number;
  material?: number;
  rolls?: number;
  sqm?: number;
}

/**
 * Interface สำหรับผลลัพธ์การคำนวณสรุป
 */
export interface SummaryTotals {
  subTotal: number;
  discountAmount: number;
  grandTotal: number;
  totalVat: number;
  totalBeforeVat: number;
}

/**
 * [HELPER] คำนวณปริมาณผ้า (หลา)
 * (Logic เดิมจาก calculations.js)
 */
const fabricYardage = (style: string, width_m: number): number => {
  const w = toNum(width_m);
  if (w <= 0) return 0;

  let fabricInMeters = 0;

  switch (style) {
    case 'ตาไก่':
      fabricInMeters = (w + 0.3) * 2.0;
      break;
    case 'จีบ':
    case 'หลุยส์': // (หลุยส์ใช้ผ้าเท่าจีบ)
      fabricInMeters = (w + 0.3) * 1.5;
      break;
    case 'พับ':
      fabricInMeters = w * 2.5;
      break;
    default: // 'ลอน' หรืออื่นๆ
      fabricInMeters = (w + 0.3) * 1.0;
      break;
  }

  const fabricInYards = fabricInMeters / PRICING.METERS_PER_YARD;
  return fabricInYards + PRICING.TIE_BACK_YARDAGE;
};

/**
 * [HELPER] คำนวณจำนวนม้วนวอลเปเปอร์
 * (Logic เดิมจาก calculations.js)
 */
const wallpaperRolls = (totalWidth: number, height: number): number => {
  if (totalWidth <= 0 || height <= 0) return 0;
  const { roll_width_m, roll_length_m } = WALLPAPER_SPECS;
  const cutsPerRoll = Math.floor(roll_length_m / (height + 0.1)); // 0.1 คือเผื่อ
  if (cutsPerRoll === 0) return 0;
  const totalCuts = Math.ceil(totalWidth / roll_width_m);
  return Math.ceil(totalCuts / cutsPerRoll);
};

/**
 * เอนจิ้นการคำนวณ (CALC)
 */
export const CALC = {
  // --- 1. Set (ม่านชุด) ---
  calculateSetPrice: (item: SetItemData): PriceResult => {
    if (item.is_suspended || item.width_m <= 0 || item.height_m <= 0) {
      return { total: 0 };
    }

    const w = toNum(item.width_m);
    const h = toNum(item.height_m);
    const fabricPriceRaw = toNum(item.price_per_m_raw);
    const sheerPrice = toNum(item.sheer_price_per_m);
    const louisPrice = toNum(item.louis_price_per_m);

    // 1. Fabric
    const fabricQty = fabricYardage(item.set_style, w);
    const fabricCost = fabricQty * fabricPriceRaw;

    // 2. Sheer (ผ้าโปร่ง)
    const sheerQty = fabricPriceRaw > 0 ? fabricQty : 0; // ใช้ผ้าโปร่งเท่าผ้าทึบ (ถ้ามีผ้าทึบ)
    const sheerCost = sheerQty * sheerPrice;

    // 3. Louis (หลุยส์)
    const louisCost = item.set_style === 'หลุยส์' ? w * louisPrice : 0;

    // 4. Sewing (ค่าตัดเย็บ)
    const styleSurcharge = PRICING.style_surcharge[item.set_style] || 0;
    const fabricVariant = PRICING.fabric_pleat_allowance[item.fabric_variant] || 1.6; // (Default 1.5)
    const sewingCost = (w * fabricVariant * PRICING.sewing_cost_per_m) + (w * styleSurcharge);
    
    // 5. Hardware (ราง) & Install (ติดตั้ง)
    const hardwareCost = w * PRICING.hardware_cost_per_m;
    const installCost = w * PRICING.install_cost_per_m;

    const total =
      fabricCost +
      sheerCost +
      louisCost +
      sewingCost +
      hardwareCost +
      installCost;

    return {
      total: Math.ceil(total),
      fabric: fabricCost,
      sheer: sheerCost,
      louis: louisCost,
      sewing: sewingCost,
      hardware: hardwareCost,
      install: installCost,
    };
  },

  // --- 2. Wallpaper ---
  calculateWallpaperPrice: (item: WallpaperItemData): PriceResult => {
    if (item.is_suspended) return { total: 0 };
    
    const totalWidth = item.widths?.reduce((sum, w) => sum + toNum(w), 0) || 0;
    if (totalWidth <= 0 || item.height_m <= 0) {
      return { total: 0 };
    }
    
    const height = toNum(item.height_m);
    const rolls = wallpaperRolls(totalWidth, height);
    const materialPrice = rolls * toNum(item.price_per_roll);

    // (จัดการค่าติดตั้ง: 0 = ฟรี,
    // (ถ้าไม่ใส่ (undefined) หรือ < 0 ให้ใช้ Default)
    let installCostPerRoll = WALLPAPER_SPECS.default_install_cost_per_roll;
    if (item.install_cost_per_roll === 0) {
      installCostPerRoll = 0;
    } else if (item.install_cost_per_roll > 0) {
      installCostPerRoll = item.install_cost_per_roll;
    }
    
    const installPrice = rolls * installCostPerRoll;
    const total = materialPrice + installPrice;

    return {
      total: Math.ceil(total),
      material: materialPrice,
      install: installPrice,
      rolls: rolls,
      sqm: (totalWidth * height),
    };
  },

  // --- 3. Area Based (มู่ลี่, ม่านม้วน ฯลฯ) ---
  calculateAreaBasedPrice: (item: AreaBasedItemData): PriceResult => {
    if (
      item.is_suspended ||
      item.width_m <= 0 ||
      item.height_m <= 0 ||
      item.price_sqyd <= 0
    ) {
      return { total: 0 };
    }

    // [FIXED] เรียกใช้ PRICING.SQM_TO_SQYD
    const sqYd = (item.width_m * item.height_m) * PRICING.SQM_TO_SQYD;
    
    // [NEW] ปัดเศษหลาขึ้น (ขั้นต่ำ 1.0 หลา)
    const finalSqYd = Math.max(1.0, Math.ceil(sqYd * 10) / 10); // ปัดทศนิยม 1 ตำแหน่ง
    
    const total = finalSqYd * toNum(item.price_sqyd);

    return {
      total: Math.ceil(total),
      sqm: finalSqYd, // (จริงๆ คือ sqYd ที่ปัดเศษแล้ว)
    };
  },

  // --- 4. Main Dispatcher ---
  /**
   * [MAIN] คำนวณราคาสินค้า 1 ชิ้น (เรียกฟังก์ชันย่อยตาม type)
   */
  calculateItemPrice: (item: ItemData): PriceResult => {
    switch (item.type) {
      case 'set':
        return CALC.calculateSetPrice(item as SetItemData);
      case 'wallpaper':
        return CALC.calculateWallpaperPrice(item as WallpaperItemData);
      case 'wooden_blind':
      case 'roller_blind':
      case 'vertical_blind':
      case 'partition':
      case 'pleated_screen':
      case 'aluminum_blind':
        return CALC.calculateAreaBasedPrice(item as AreaBasedItemData);
      default:
        return { total: 0 };
    }
  },

  /**
   * คำนวณสรุปยอดรวมทั้งหมด
   */
  calculateSummaryTotals: (
    rooms: RoomData[],
    discount: DiscountData
  ): SummaryTotals => {
    // 1. SubTotal
    const subTotal = rooms.reduce((roomSum, room) => {
      if (room.is_suspended) return roomSum;
      const itemsTotal = room.items.reduce((itemSum, item) => {
        return itemSum + CALC.calculateItemPrice(item).total;
      }, 0);
      return roomSum + itemsTotal;
    }, 0);

    // 2. Discount
    let discountAmount = 0;
    if (discount.type === 'amount') {
      discountAmount = toNum(discount.value);
    } else if (discount.type === 'percent') {
      discountAmount = subTotal * (toNum(discount.value) / 100);
    }

    // 3. Totals
    const grandTotal = Math.max(0, subTotal - discountAmount);
    
    // [NEW] คำนวณ VAT (จาก V6)
    const totalBeforeVat = grandTotal / (1 + PRICING.vat_rate);
    const totalVat = grandTotal - totalBeforeVat;

    return {
      subTotal: Math.round(subTotal),
      discountAmount: Math.round(discountAmount),
      grandTotal: Math.round(grandTotal),
      totalVat: Math.round(totalVat),
      totalBeforeVat: Math.round(totalBeforeVat),
    };
  },
};