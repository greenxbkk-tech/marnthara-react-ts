// src/store/store.ts
// [UPDATED] ไฟล์สมองที่สมบูรณ์ พร้อม "นักบัญชี" และ Actions ทั้งหมด

import { create } from 'zustand';
// [CRITICAL FIX] แก้ไข Path การ Import ที่เป็นต้นตอของปัญหา
// 'temporal' มาจาก 'zundo'
// 'devtools' และ 'persist' มาจาก 'zustand/middleware'
import { temporal } from 'zundo';
import { devtools, persist } from 'zustand/middleware';
import { APP_VERSION, STORAGE_KEY } from '../lib/config';
import { shallow } from 'zustand/shallow';
import { CALC } from '../lib/calculations';
// [NEW] Import types และ helpers ที่จำเป็น
import type {
  ItemData,
  ItemType,
  RoomData,
  DiscountData,
  AppPayload,
  FavoritesData,
  FullAppState, // (คุณต้องไปเพิ่ม props ใน types.ts ด้วย)
} from './types';
import {
  getFavoritesFromStorage,
  saveFavoritesToStorage,
  addOrUpdateFavorite,
  deleteFavorite,
} from '../lib/favorites';

// --- สร้าง Store ---
export const useAppStore = create<FullAppState>()(
  devtools(
    temporal(
      persist(
        (set, get) => ({
          // --- ค่าเริ่มต้นของ State ---
          app_version: APP_VERSION,
          customer: {
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            customer_card_open: true,
          },
          discount: { type: 'amount', value: 0 },
          rooms: [],
          favorites: getFavoritesFromStorage(), // [NEW] โหลด Favorites จาก Storage

          // [NEW] "ไวท์บอร์ด" สำหรับเก็บยอดรวม
          subTotal: 0,
          discountAmount: 0,
          grandTotal: 0,

          // --- [INTERNAL] "นักบัญชี" ---
          _recalculateTotals: () => {
            const { rooms, discount } = get();
            const { subTotal, discountAmount, grandTotal } =
              CALC.calculateSummaryTotals(rooms, discount);
            set({ subTotal, discountAmount, grandTotal });
          },

          // --- Actions (Customer) ---
          updateCustomer: (field, value) => {
            set((state) => ({
              customer: { ...state.customer, [field]: value },
            }));
          },
          toggleCustomerCard: () => {
            set((state) => ({
              customer: {
                ...state.customer,
                customer_card_open: !state.customer.customer_card_open,
              },
            }));
          },

          // --- Actions (Room) ---
          addRoom: () => {
            const newRoom: RoomData = {
              id: `room-${Date.now()}`,
              room_name: `ห้อง ${get().rooms.length + 1}`,
              is_suspended: false,
              is_open: true,
              room_defaults: {},
              items: [],
            };
            set((state) => ({
              rooms: [...state.rooms, newRoom],
            }));
            // (การเพิ่มห้องเปล่า ไม่กระทบราคา ไม่ต้องเรียกนักบัญชี)
          },
          updateRoomName: (roomId, newName) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, room_name: newName } : room
              ),
            }));
          },
          toggleRoomOpen: (roomId) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, is_open: !room.is_open } : room
              ),
            }));
          },
          toggleRoomSuspended: (roomId: string) => {
            // (Action นี้จำเป็น)
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? { ...room, is_suspended: !room.is_suspended }
                  : room
              ),
            }));
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
          deleteRoom: (roomId: string) => {
            if (!window.confirm('คุณต้องการลบห้องนี้และทุกรายการในห้อง?')) return;
            set((state) => ({
              rooms: state.rooms.filter((room) => room.id !== roomId),
            }));
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },

          // --- Actions (Item) ---
          addItem: (roomId: string, type: ItemType) => {
            // (ตรรกะการสร้าง Item ใหม่ - คุณต้องไปเพิ่มรายละเอียด default)
            const newItem: ItemData = {
              id: `item-${Date.now()}`,
              type: type,
              is_suspended: false,
              is_details_open: false,
              // (เพิ่ม default fields ตาม type)
            } as ItemData;

            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? { ...room, items: [...room.items, newItem] }
                  : room
              ),
            }));
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
          updateItem: (
            roomId: string,
            itemId: string,
            data: Partial<ItemData>
          ) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? {
                      ...room,
                      items: room.items.map((item) =>
                        item.id === itemId ? { ...item, ...data } : item
                      ),
                    }
                  : room
              ),
            }));
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
          deleteItem: (roomId: string, itemId: string) => {
            // (ถ้าต้องการ confirm ให้ทำที่ ItemHeader.tsx)
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? {
                      ...room,
                      items: room.items.filter((item) => item.id !== itemId),
                    }
                  : room
              ),
            }));
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
          duplicateItem: (roomId: string, itemId: string) => {
            set((state) => {
              const room = state.rooms.find((r) => r.id === roomId);
              const itemToCopy = room?.items.find((i) => i.id === itemId);
              if (!room || !itemToCopy) return state;

              const newItem = { ...itemToCopy, id: `item-${Date.now()}` };

              return {
                rooms: state.rooms.map((r) =>
                  r.id === roomId ? { ...r, items: [...r.items, newItem] } : r
                ),
              };
            });
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
          changeItemType: (
            roomId: string,
            itemId: string,
            newType: ItemType
          ) => {
            // (ตรรกะการแปลง Item type - คุณต้องเพิ่มเอง)
            // ...
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },

          // --- Actions (Discount) ---
          updateDiscount: (newDiscount: DiscountData) => {
            set({ discount: newDiscount });
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },

          // --- Actions (Favorites) ---
          addFavorite: (type, code, price) => {
            const newFavorites = addOrUpdateFavorite(
              get().favorites,
              type,
              code,
              price
            );
            set({ favorites: newFavorites });
            saveFavoritesToStorage(newFavorites);
            // (ไม่กระทบราคา ไม่ต้องเรียกนักบัญชี)
          },
          deleteFavorite: (type, code) => {
            const newFavorites = deleteFavorite(get().favorites, type, code);
            set({ favorites: newFavorites });
            saveFavoritesToStorage(newFavorites);
          },

          // --- Actions (Data Import/Export) ---
          loadState: (payload: AppPayload) => {
            set({
              customer: {
                customer_name: payload.customer_name,
                customer_phone: payload.customer_phone,
                customer_address: payload.customer_address,
                customer_card_open: payload.customer_card_open,
              },
              discount: payload.discount,
              rooms: payload.rooms,
            });
            get()._recalculateTotals(); // "ตระโกนเรียก" หลังโหลด
          },
          importFavorites: (favorites: FavoritesData) => {
            set({ favorites });
            saveFavoritesToStorage(favorites);
          },
          resetState: () => {
            if (!window.confirm('คุณต้องการลบข้อมูลทั้งหมดและเริ่มใหม่?')) return;
            // (ตรรกะการ Reset state กลับค่าเริ่มต้น)
            set({
              customer: {
                /* ...ค่าเริ่มต้น... */
              },
              discount: { type: 'amount', value: 0 },
              rooms: [],
            });
            get()._recalculateTotals(); // "ตระโกนเรียก"
          },
        }),
        {
          name: STORAGE_KEY,
          version: 1,
          migrate: (persistedState: any, version: number) => {
            return persistedState;
          },
          // [NEW] คำนวณยอดรวมครั้งแรกเมื่อโหลดข้อมูลจาก localStorage
          onRehydrateStorage: () => (state) => {
            if (state) {
              state._recalculateTotals();
            }
          },
        }
      ),
      {
        limit: 10,
        partialize: (state) => {
          // (โค้ด partialize เดิมของคุณ)
          const { customer, rooms, discount, ...rest } = state;
          const { customer_card_open, ...restCustomer } = customer;
          const stableRooms = rooms.map(({ is_open, ...restRoom }) => restRoom);
          return { customer: restCustomer, rooms: stableRooms, discount };
        },
      }
    )
  )
);