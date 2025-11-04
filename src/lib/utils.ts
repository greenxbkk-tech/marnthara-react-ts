// src/lib/utils.ts
// [REFACTORED] แปลงเป็น TypeScript

import React from 'react'; // Import React types
import { TxtNumArr, TxtDigitArr } from './bahttextData'; // (สมมติว่าแยกข้อมูลไปอีกไฟล์)

/**
 * แปลงค่าใดๆ (string, number) เป็น number (ทศนิยมได้)
 * @param v - ค่าที่รับเข้ามา (จัดการ comma)
 * @returns {number} - ตัวเลข (default 0)
 */
export const toNum = (v: any): number => {
  if (typeof v === 'string') v = v.replace(/,/g, '');
  const num = parseFloat(v);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Format ตัวเลขเป็น string ทศนิยม 2 ตำแหน่ง (สำหรับขนาด)
 * @param v - ค่าที่รับเข้ามา
 * @returns {string} - "x.xx" (ถ้า 0 จะคืนค่า string ว่าง)
 */
export const fmtDimension = (v: any): string => {
  const num = toNum(v);
  return num > 0 ? num.toFixed(2) : '';
};

/**
 * [REACT ADAPTED] จัดการการแปลง CM -> M เมื่อ input (ขนาด) blur
 * @param {React.FocusEvent<HTMLInputElement>} e - Event จาก React
 */
export const handleCmToMBlur = (e: React.FocusEvent<HTMLInputElement>): string => {
  const input = e.target;
  const value = input.value.trim();

  if (value === '') return '';

  let num = toNum(value); // toNum handles commas
  if (num <= 0) return '';

  // ถ้าใส่เลขจำนวนเต็ม (เช่น 150) -> แปลงเป็นเมตร (1.50)
  if (Math.floor(num) === num && num > 5) { // 5 ถือเป็น 5 เมตร
    num = num / 100;
  }
  
  const formattedValue = num.toFixed(2);
  input.value = formattedValue; // อัปเดต UI (ถ้ายังใช้ uncontrolled)
  return formattedValue; // คืนค่าที่แปลงแล้วให้ State
};

/**
 * Format ตัวเลขเป็น string (x.xx)
 * @param v - ค่าที่รับเข้ามา
 * @returns {string} - "x.xx" (ถ้า 0 ก็ "0.00")
 */
export const fmt = (v: any): string => {
  const num = toNum(v);
  return num.toFixed(2);
};

/**
 * Format ตัวเลขเป็น string (x,xxx.xx)
 * @param v - ค่าที่รับเข้ามา
 * @returns {string} - "x,xxx.xx"
 */
export const fmtTH = (v: any): string => {
  const num = toNum(v);
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Sanitize HTML string
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export const sanitizeHTML = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitize string for use in a filename.
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
export const sanitizeForFilename = (str: string | null | undefined): string => {
  if (!str) return 'file';
  return str.replace(/[\\/*?:"<>|]/g, '_').replace(/\s+/g, ' ').trim();
};

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;
  return function (...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func(...args);
    }
    return lastResult;
  };
}

/**
 * แปลงตัวเลขเป็นข้อความ (บาท)
 * (โค้ดส่วน BahtText จาก utils.js)
 */
export function bahttext(v: any): string {
  let number = toNum(v);
  if (number === 0) return 'ศูนย์บาทถ้วน';

  number = parseFloat(number.toFixed(2));
  let integerPart = Math.floor(number);
  let decimalPart = Math.round((number - integerPart) * 100);

  const read = (n: number): string => {
    if (n === 0) return '';
    let str = '';
    const s = String(n);
    for (let i = 0; i < s.length; i++) {
      const digit = s[i];
      const position = s.length - i - 1;

      if (digit === '0') continue;

      if (position === 1 && digit === '1') {
        str += TxtDigitArr[position];
      } else if (position === 1 && digit === '2') {
        str += 'ยี่' + TxtDigitArr[position];
      } else if (position === 0 && digit === '1' && s.length > 1) {
        str += 'เอ็ด';
      } else {
        str += TxtNumArr[parseInt(digit)] + TxtDigitArr[position];
      }
    }
    return str;
  };

  let bahtStr = '';
  if (integerPart > 0) {
    const millions = Math.floor(integerPart / 1000000);
    const remainder = integerPart % 1000000;
    if (millions > 0) {
      bahtStr += read(millions) + 'ล้าน';
    }
    bahtStr += read(remainder);
    bahtStr += 'บาท';
  } else if (integerPart === 0) {
     bahtStr = 'ศูนย์บาท';
  }

  let satangStr = '';
  if (decimalPart > 0) {
    satangStr = read(decimalPart) + 'สตางค์';
  } else {
    satangStr = 'ถ้วน';
  }

  return bahtStr + satangStr;
}