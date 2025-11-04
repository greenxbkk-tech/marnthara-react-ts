// src/lib/config.ts
// [REFACTORED] แปลงเป็น TypeScript และรวมค่าคงที่ (Constants) ทั้งหมด
// OMITTED: SELECTORS (ไม่จำเป็นสำหรับ React)

export const APP_VERSION = "react-ts/7.0.0";
export const STORAGE_KEY = "marnthara.input.v7.0"; // [NEW] Storage Key
export const PDF_EXPORT_DELAY_MS = 500;

// --- Shop & PDF Configuration ---
export const SHOP_CONFIG = {
  name: "ม่านธารา ผ้าม่านและของตกแต่ง",
  address: "65/8 หมู่ 2 ต.ท่าศาลา อ.เมือง จ.ลพบุรี 15000",
  phone: "092-985-9395, 082-552-5595",
  taxId: "1600668000020",
  logoUrl: "", // "" to disable
  baseVatRate: 0.07,
  pdf: {
    paymentTerms: "ชำระมัดจำ 50%",
    priceValidity: "30 วัน",
    notes: [
      "ราคานี้รวมค่าติดตั้งแล้ว",
      "ชำระมัดจำ 50% เพื่อยืนยืนการสั่งผลิตสินค้า",
      "ใบเสนอราคานี้มีอายุ 90 วัน นับจากวันที่เสนอราคา",
    ],
  },
};

// --- Pricing Configuration (Synthesized from calculations.js) ---
export const PRICING = {
  // ค่าเย็บตามสไตล์ (บาท/เมตร)
  style_surcharge: {
    'จีบ': 150,
    'ตาไก่': 250,
    'ลอน': 250,
    'พับ': 350,
    'หลุยส์': 0, // หลุยส์คิดราคาแยก
  },
  // ค่าเย็บผ้าโปร่ง (บาท/เมตร)
  sheer_sewing_cost_per_m: 100,
  // ค่าอุปกรณ์ (บาท/เมตร)
  hardware_cost_per_m: 150,
  // ค่าติดตั้ง (บาท/เมตร)
  install_cost_per_m: 150,
  
  // ปริมาณผ้า (หลา) ที่ใช้สำหรับทำจีบ (อ้างอิงจาก calculations.js)
  fabric_pleat_allowance: {
    '1.5': 1.6,
    '2.0': 2.2,
    '2.5': 2.6,
    '3.0': 3.2,
    'เย็บสำเร็จ': 0,
  },
  // ค่าคงที่อื่นๆ
  METERS_PER_YARD: 0.9144, // 1 หลา = 0.9144 เมตร
  SQM_TO_SQYD: 1.19599, // 1 ตร.ม. = 1.19599 ตร.หลา
  TIE_BACK_YARDAGE: 0.5, // ค่าเผื่อผ้าสำหรับสายรวบ
};

// --- Wallpaper Configuration (Synthesized from calculations.js) ---
export const WALLPAPER_SPECS = {
  roll_width_m: 0.53, // ความกว้างวอลเปเปอร์ (เมตร)
  roll_length_m: 10,  // ความยาววอลเปเปอร์ (เมตร)
  default_install_cost_per_roll: 300,
};

// --- Item Type Configuration (Synthesized from AreaBasedItem.js) ---
interface ItemConfig {
  [key: string]: {
    name: string;
    className: string;
  };
}

export const ITEM_CONFIG: ItemConfig = {
  set: { name: 'ม่านเป็นชุด', className: 'set-item' },
  wallpaper: { name: 'วอลเปเปอร์', className: 'wallpaper-item' },
  wooden_blind: { name: 'มู่ลี่ไม้', className: 'wooden-blind-item' },
  roller_blind: { name: 'ม่านม้วน', className: 'roller-blind-item' },
  vertical_blind: { name: 'ม่านปรับแสง', className: 'vertical-blind-item' },
  partition: { name: 'ฉากกั้นห้อง', className: 'partition-item' },
  pleated_screen: { name: 'มุ้งจีบ', className: 'pleated-screen-item' },
  aluminum_blind: { name: 'มู่ลี่อลูมิเนียม', className: 'aluminum-blind-item' },
};