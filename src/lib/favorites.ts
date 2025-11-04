// src/lib/favorites.ts
// [NEW] ย้าย Logic จาก favorites.js

import { FavoritesData, Favorite } from '../store/types';

export const FAVORITES_KEY = 'marnthara.favorites.v4'; // (ใช้ Key เดิม)

const defaultFavorites: FavoritesData = {
  fabric: [],
  sheer: [],
  wallpaper: [],
  wooden_blind: [],
  roller_blind: [],
  vertical_blind: [],
  partition: [],
  pleated_screen: [],
  aluminum_blind: [],
};

/**
 * ดึงข้อมูล Favorites ทั้งหมดจาก localStorage
 */
export function getFavoritesFromStorage(): FavoritesData {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    // [NEW] ตรวจสอบให้แน่ใจว่า Key ทั้งหมดจาก default มีอยู่
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...defaultFavorites, ...parsed };
  } catch (e) {
    console.error('Failed to parse favorites from localStorage', e);
    return defaultFavorites;
  }
}

/**
 * บันทึก Favorites ทั้งหมดลง localStorage
 */
export function saveFavoritesToStorage(favorites: FavoritesData) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites to localStorage', e);
  }
}

/**
 * [HELPER] ใช้สำหรับ Zustand store
 * เพิ่มหรืออัปเดต Favorite 1 รายการ
 */
export function addOrUpdateFavorite(
  favorites: FavoritesData,
  type: keyof FavoritesData,
  code: string,
  price: number
): FavoritesData {
  const cleanCode = code?.trim();
  if (!favorites[type] || !cleanCode) return favorites;

  const newFav: Favorite = { code: cleanCode, price };
  const index = favorites[type].findIndex((fav) => fav.code === cleanCode);

  const newTypeList = [...favorites[type]];
  if (index > -1) {
    // Update
    newTypeList[index] = newFav;
  } else {
    // Add
    newTypeList.push(newFav);
    // Sort
    newTypeList.sort((a, b) => a.code.localeCompare(b.code));
  }
  
  return { ...favorites, [type]: newTypeList };
}

/**
 * [HELPER] ใช้สำหรับ Zustand store
 * ลบ Favorite 1 รายการ
 */
export function deleteFavorite(
  favorites: FavoritesData,
  type: keyof FavoritesData,
  code: string
): FavoritesData {
  const cleanCode = code?.trim();
  if (!favorites[type] || !cleanCode) return favorites;

  const newTypeList = favorites[type].filter((fav) => fav.code !== cleanCode);
  return { ...favorites, [type]: newTypeList };
}