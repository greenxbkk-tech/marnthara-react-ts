// src/lib/data-import-export.ts
// [NEW] Logic สำหรับ Import/Export ข้อมูล (JSON)

import { useAppStore } from '../store/store';
import { AppPayload } from '../store/types';
import { sanitizeForFilename } from './utils';

/**
 * [EXPORT] สร้าง Payload และกระตุ้นการดาวน์โหลดไฟล์ .json
 */
export const exportDataAsJson = () => {
  try {
    // [NEW] ดึง State ปัจจุบันจาก Zustand
    // (Zustand ไม่ได้มี 'buildPayload' เราจึงต้องสร้าง Payload จาก state)
    const state = useAppStore.getState();
    const payload: AppPayload = {
      app_version: state.app_version,
      customer_name: state.customer_name,
      customer_phone: state.customer_phone,
      customer_address: state.customer_address,
      customer_card_open: state.customer_card_open,
      discount: state.discount,
      rooms: state.rooms,
      favorites: state.favorites, // [NEW] Export favorites ด้วย
    };

    const customerName = payload.customer_name || 'backup';
    const date = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const filename = `Marnthara_Backup_${sanitizeForFilename(customerName)}_${date}.json`;
    
    const dataStr = JSON.stringify(payload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    // สร้าง Link ชั่วคราวเพื่อดาวน์โหลด
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', filename);
    link.click();
    link.remove();
    
    return { success: true, message: 'ดาวน์โหลดข้อมูลสำเร็จ' };
  } catch (error) {
    console.error('Export failed:', error);
    return { success: false, message: 'การสำรองข้อมูลล้มเหลว' };
  }
};

/**
 * [IMPORT] อ่านไฟล์ .json และอัปเดต Store
 */
export const importDataFromFile = (file: File): Promise<{ success: boolean; message: string; }> => {
  return new Promise((resolve) => {
    if (!file || file.type !== 'application/json') {
      resolve({ success: false, message: 'กรุณาเลือกไฟล์ .json ที่ถูกต้อง' });
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const payload = JSON.parse(text) as AppPayload;

        // [NEW] ตรวจสอบ Payload
        if (!payload || !payload.app_version || !Array.isArray(payload.rooms)) {
          throw new Error('ไฟล์ข้อมูลไม่ถูกต้องหรือไม่ครบถ้วน');
        }

        // [NEW] เรียก Action 'loadState' และ 'importFavorites'
        const { loadState, importFavorites, clear } = useAppStore.getState();
        
        // 1. โหลดข้อมูลหลัก (Rooms, Customer)
        loadState(payload); 
        
        // 2. โหลด Favorites (ถ้ามีในไฟล์)
        if (payload.favorites) {
          importFavorites(payload.favorites);
        }
        
        // 3. ล้างประวัติ Undo/Redo
        clear();

        resolve({ success: true, message: 'นำเข้าข้อมูลสำเร็จ!' });

      } catch (error: any) {
        console.error('Import failed:', error);
        resolve({ success: false, message: `นำเข้าล้มเหลว: ${error.message}` });
      }
    };
    
    reader.onerror = (error) => {
      console.error('File reading error:', error);
      resolve({ success: false, message: 'ไม่สามารถอ่านไฟล์ได้' });
    };

    reader.readAsText(file);
  });
};