// src/lib/toast.ts
// [NEW] Wrapper สำหรับระบบแจ้งเตือน (Toast)
// (Replaces ui.js 'showToast')

import toast, { CheckmarkIcon, ErrorIcon } from 'react-hot-toast';

/**
 * แสดง Toast (การแจ้งเตือน)
 * @param message - ข้อความที่จะแสดง
 * @param type - 'success' (สีเขียว) หรือ 'error' (สีแดง)
 * @param durationMs - (Optional) เวลา (default 2000ms)
 */
export const showToast = (
  message: string,
  type: 'success' | 'error' = 'success',
  durationMs: number = 2000
) => {
  
  // [NEW] ใช้ react-hot-toast
  toast.custom(
    (t) => (
      // (ใช้ CSS .toast-notification จาก main.css)
      <div
        className={`toast-notification ${
          type === 'error' ? 'toast-error' : 'toast-success'
        } ${t.visible ? 'toast-enter' : 'toast-leave'}`}
      >
        <div className="toast-icon">
          {type === 'success' ? <CheckmarkIcon /> : <ErrorIcon />}
        </div>
        <div className="toast-message">{message}</div>
      </div>
    ),
    {
      duration: durationMs,
      position: 'bottom-center',
    }
  );
};

// [NEW] เราสามารถ export toast โดยตรง เผื่อใช้ฟีเจอร์ซับซ้อน (เช่น loading)
// export default toast;