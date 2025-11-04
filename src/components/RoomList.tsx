// src/store/store.ts
import { create } from 'zustand';
import { temporal } from 'zundo'; 
import { devtools, persist } from 'zustand/middleware'; 
import { APP_VERSION, STORAGE_KEY } from '../lib/config';
import { shallow } from 'zustand/shallow'; // เพิ่มการ Import shallow (เผื่อใช้ใน Store)

// --- สร้าง Types (เหมือนเดิม) ---
// ... (Your existing types: Customer, Discount, Item, Room, FullAppState)

// --- สร้าง Store ---
export const useAppStore = create<FullAppState>()(
  devtools(
    temporal( 
      persist( 
        (set, get) => ({
          // --- ค่าเริ่มต้นของ State ---
          customer: {
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            customer_card_open: true,
          },
          discount: { type: 'amount', value: 0 }, 
          rooms: [],

          // --- Actions (เหมือนเดิม) ---
          updateCustomer: (field, value) => {
            set((state) => ({
              customer: { ...state.customer, [field]: value },
            }));
          },
          
          toggleCustomerCard: () => {
            set((state) => ({
              customer: { ...state.customer, customer_card_open: !state.customer.customer_card_open }
            }));
          },

          updateRoomName: (roomId, newName) => {
            set((state) => ({
              rooms: state.rooms.map(room => 
                room.id === roomId ? { ...room, room_name: newName } : room
              ),
            }));
          },

          toggleRoomOpen: (roomId) => {
            set((state) => ({
              rooms: state.rooms.map(room => 
                room.id === roomId ? { ...room, is_open: !room.is_open } : room
              ),
            }));
          },

          addRoom: () => {
            const newRoom: Room = {
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
          },

        }),
        {
          // --- ตั้งค่า Persist (localStorage) ---
          name: STORAGE_KEY, 
          version: 1, 
          // [FIX] เพิ่ม migrate function เพื่อปิด Warning
          migrate: (persistedState: any, version: number) => {
              if (version === 0) {
                  // โครงสร้าง v0 -> v1 (ยังไม่เปลี่ยนมาก)
                  return persistedState;
              }
              // ถ้าเวอร์ชั่นไม่ตรงกับที่คาดไว้ ให้คืน state เดิมไป 
              // (ในกรณีนี้คือการโหลด state ที่มี version: 1 อยู่แล้ว)
              return persistedState;
          }
        }
      ),
      {
        // --- ตั้งค่า Temporal (zundo) ---
        limit: 10, 
        partialize: (state) => {
          const { customer, rooms, ...rest } = state;
          const { customer_card_open, ...restCustomer } = customer; 
          const stableRooms = rooms.map(({ is_open, ...restRoom }) => restRoom);

          return { customer: restCustomer, rooms: stableRooms, ...rest };
        }
      }
    )
  )
);