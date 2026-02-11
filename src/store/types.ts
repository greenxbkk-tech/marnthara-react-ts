// src/store/types.ts
// [NEW] ไฟล์นิยาม Type/Interface กลางสำหรับโปรเจกต์ (TypeScript)
// สังเคราะห์จากโครงสร้างข้อมูลใน storage.js (buildPayload)
// [FIXED] อัปเดต Type ให้ตรงกับ store.ts

// --- Base Types ---

export interface CustomerData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_card_open: boolean;
}

export interface DiscountData {
  type: 'amount' | 'percent';
  value: number;
}

export interface Favorite {
  code: string;
  price: number;
}

export interface FavoritesData {
  [key: string]: Favorite[];
  fabric: Favorite[];
  sheer: Favorite[];
  wallpaper: Favorite[];
  wooden_blind: Favorite[];
  roller_blind: Favorite[];
  vertical_blind: Favorite[];
  partition: Favorite[];
  pleated_screen: Favorite[];
  aluminum_blind: Favorite[];
}

// --- Item Types (Discriminated Union) ---

/**
 * คุณสมบัติพื้นฐานที่ทุก Item ต้องมี
 */
export interface ItemBase {
  id: string; // Unique ID (e.g., 'item-1721029384910')
  type: ItemType;
  is_suspended: boolean;
  is_details_open: boolean;
  notes?: string;
}

/**
 * ประเภทของ Item ทั้งหมดที่เป็นไปได้
 */
export type ItemType = 'set' | 'wallpaper' | AreaBasedItemType;

export type AreaBasedItemType =
  | 'wooden_blind'
  | 'roller_blind'
  | 'vertical_blind'
  | 'partition'
  | 'pleated_screen'
  | 'aluminum_blind';

/**
 * Item ประเภท "ม่านเป็นชุด" (ผ้าทึบ + ผ้าโปร่ง + หลุยส์)
 */
export interface SetItemData extends ItemBase {
  type: 'set';
  width_m: number;
  height_m: number;
  set_style: 'จีบ' | 'ตาไก่' | 'ลอน' | 'พับ' | 'หลุยส์';
  fabric_variant: '1.5' | '2.0' | '2.5' | '3.0' | 'เย็บสำเร็จ';
  price_per_m_raw: number; // ราคาผ้าทึบ (ดิบ)
  sheer_price_per_m: number; // ราคาผ้าโปร่ง
  louis_price_per_m: number; // [NEW] ราคาหลุยส์
  fabric_code?: string;
  sheer_fabric_code?: string;
  opening_style: 'แยกกลาง' | 'เก็บข้างเดียว';
  adjustment_side: 'ปรับซ้าย' | 'ปรับขวา' | 'ปรับสองข้าง'; // [NEW]
  // Hardware details
  track_color: string;
  bracket_color: string;
  finial_color: string;
  grommet_color: string;
  louis_valance: string; // [NEW]
  louis_tassels: string; // [NEW]
}

/**
 * Item ประเภท "วอลเปเปอร์"
 */
export interface WallpaperItemData extends ItemBase {
  type: 'wallpaper';
  height_m: number;
  widths: number[]; // Array ของความกว้างผนังแต่ละด้าน
  price_per_roll: number;
  install_cost_per_roll: number; // ค่าติดตั้งต่อม้วน (อาจเป็น 0)
  code?: string;
}

/**
 * Item ประเภท "คิดราคาตามพื้นที่" (มู่ลี่, ม่านม้วน, ฉากกั้น ฯลฯ)
 */
export interface AreaBasedItemData extends ItemBase {
  type: AreaBasedItemType;
  width_m: number;
  height_m: number;
  price_sqyd: number; // ราคาต่อหลา
  code?: string;
  // Fields สำหรับบางประเภท
  opening_style?: 'แยกกลาง' | 'เก็บข้างเดียว'; // For partition, pleated_screen
  adjustment_side?: 'ปรับซ้าย' | 'ปรับขวา'; // For blinds
}

/**
 * Union Type สำหรับ Item ทุกประเภท
 */
export type ItemData = SetItemData | WallpaperItemData | AreaBasedItemData;

// --- Room & Payload (State) ---

export interface RoomData {
  id: string; // Unique ID (e.g., 'room-1721029384900')
  room_name: string;
  is_suspended: boolean;
  is_open: boolean;
  room_defaults: { [key: string]: any }; // สำหรับเก็บค่าเริ่มต้นของห้อง
  items: ItemData[];
}

/**
 * โครงสร้างข้อมูลหลัก (Payload) ที่ใช้บันทึกและเป็น State หลักของแอป
 * [FIXED] แก้ไข Customer ให้ตรงกับที่ store.ts คาดหวัง (loadState)
 */
export interface AppPayload {
  app_version: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_card_open: boolean;
  discount: DiscountData;
  rooms: RoomData[];
  favorites: FavoritesData;
}

// --- สำหรับ Zustand Store ---

/**
 * [NEW] โครงสร้าง State ภายในของ Zustand (ที่ใช้ nested customer)
 */
export interface AppStateInternal {
  app_version: string;
  customer: CustomerData; // [FIXED] ใช้แบบ nested
  discount: DiscountData;
  rooms: RoomData[];
  favorites: FavoritesData;
  
  // "ไวท์บอร์ด" (Transient State)
  subTotal: number;
  discountAmount: number;
  grandTotal: number;
}

/**
 * [NEW] Actions ทั้งหมดที่นิยามใน store.ts
 */
export interface AppActions {
  _recalculateTotals: () => void;
  
  // Customer
  updateCustomer: (field: keyof CustomerData, value: string | boolean) => void;
  toggleCustomerCard: () => void;
  
  // Room
  addRoom: () => void;
  updateRoomName: (roomId: string, newName: string) => void;
  toggleRoomOpen: (roomId: string) => void;
  toggleRoomSuspended: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;
  
  // Item
  addItem: (roomId: string, type: ItemType) => void;
  updateItem: (roomId: string, itemId: string, data: Partial<ItemData>) => void;
  deleteItem: (roomId: string, itemId: string) => void;
  duplicateItem: (roomId: string, itemId: string) => void;
  changeItemType: (roomId: string, itemId: string, newType: ItemType) => void;

  // Discount
  updateDiscount: (newDiscount: DiscountData) => void;

  // Favorites
  addFavorite: (type: keyof FavoritesData, code: string, price: number) => void;
  deleteFavorite: (type: keyof FavoritesData, code: string) => void;

  // Data I/O
  loadState: (payload: AppPayload) => void;
  importFavorites: (favorites: FavoritesData) => void;
  resetState: () => void;
}

/**
 * [NEW] Type สมบูรณ์สำหรับ Store (State + Actions) ที่ store.ts เรียกหา
 */
export type FullAppState = AppStateInternal & AppActions;