// src/store/store.ts
// [UPDATED] Fix infinite update loop by exposing primitive customer_* fields
// and making updateCustomer accept both (field, value) and (partialObj).
import { create } from 'zustand';
import { temporal } from 'zundo';
import { devtools, persist } from 'zustand/middleware';
import { APP_VERSION, STORAGE_KEY } from '../lib/config';
import { shallow } from 'zustand/shallow';
import { CALC } from '../lib/calculations';
import type {
  ItemData,
  ItemType,
  RoomData,
  DiscountData,
  AppPayload,
  FavoritesData,
  FullAppState,
  CustomerData,
} from './types';
import {
  getFavoritesFromStorage,
  saveFavoritesToStorage,
  addOrUpdateFavorite,
  deleteFavorite,
} from '../lib/favorites';

export const useAppStore = create<FullAppState>()(
  devtools(
    temporal(
      persist(
        (set, get) => ({
          // --- App meta ---
          app_version: APP_VERSION,

          // --- Customer stored as object (for compatibility) ---
          customer: {
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            customer_card_open: true,
          },

          // --- Also expose flat primitives so selectors can pick stable primitives ---
          customer_name: '',
          customer_phone: '',
          customer_address: '',
          customer_card_open: true,

          // --- Discount / rooms / favorites / totals ---
          discount: { type: 'amount', value: 0 },
          rooms: [],
          favorites: getFavoritesFromStorage(),

          subTotal: 0,
          discountAmount: 0,
          grandTotal: 0,

          // --- Internal: recalc totals ---
          _recalculateTotals: () => {
            const { rooms, discount } = get();
            const { subTotal, discountAmount, grandTotal } =
              CALC.calculateSummaryTotals(rooms, discount);
            // set only numeric totals to avoid changing object shapes frequently
            set({ subTotal, discountAmount, grandTotal });
          },

          // --- Actions: Customer ---
          /**
           * updateCustomer can be used in two ways:
           *  - updateCustomer('customer_name', 'Somchai')
           *  - updateCustomer({ customer_name: 'Somchai', customer_phone: '081...' })
           *
           * It updates both customer (object) and the flat primitives to keep selectors stable.
           */
          updateCustomer: (fieldOrObj: string | Partial<CustomerData>, value?: any) => {
            if (typeof fieldOrObj === 'string') {
              const field = fieldOrObj as keyof CustomerData;
              const payload = { [field]: value } as Partial<CustomerData>;
              set((state) => ({
                customer: { ...state.customer, ...payload },
                // update flat primitives if present in payload
                ...(payload.customer_name !== undefined ? { customer_name: payload.customer_name } : {}),
                ...(payload.customer_phone !== undefined ? { customer_phone: payload.customer_phone } : {}),
                ...(payload.customer_address !== undefined ? { customer_address: payload.customer_address } : {}),
                ...(payload.customer_card_open !== undefined ? { customer_card_open: payload.customer_card_open } : {}),
              }));
            } else {
              const payload = fieldOrObj as Partial<CustomerData>;
              set((state) => ({
                customer: { ...state.customer, ...payload },
                ...(payload.customer_name !== undefined ? { customer_name: payload.customer_name } : {}),
                ...(payload.customer_phone !== undefined ? { customer_phone: payload.customer_phone } : {}),
                ...(payload.customer_address !== undefined ? { customer_address: payload.customer_address } : {}),
                ...(payload.customer_card_open !== undefined ? { customer_card_open: payload.customer_card_open } : {}),
              }));
            }
          },

          toggleCustomerCard: () => {
            set((state) => {
              const open = !state.customer.customer_card_open;
              return {
                customer: { ...state.customer, customer_card_open: open },
                customer_card_open: open,
              };
            });
          },

          // --- Actions: Room ---
          addRoom: () => {
            const newRoom: RoomData = {
              id: `room-${Date.now()}`,
              room_name: `ห้อง ${get().rooms.length + 1}`,
              is_suspended: false,
              is_open: true,
              room_defaults: {},
              items: [],
            };
            set((state) => ({ rooms: [...state.rooms, newRoom] }));
          },

          updateRoomName: (roomId: string, newName: string) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, room_name: newName } : room
              ),
            }));
          },

          toggleRoomOpen: (roomId: string) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, is_open: !room.is_open } : room
              ),
            }));
          },

          toggleRoomSuspended: (roomId: string) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? { ...room, is_suspended: !room.is_suspended }
                  : room
              ),
            }));
            get()._recalculateTotals();
          },

          deleteRoom: (roomId: string) => {
            if (!window.confirm('คุณต้องการลบห้องนี้และทุกรายการในห้อง?')) return;
            set((state) => ({ rooms: state.rooms.filter((room) => room.id !== roomId) }));
            get()._recalculateTotals();
          },

          // --- Actions: Item ---
          addItem: (roomId: string, type: ItemType) => {
            const newItem: ItemData = {
              id: `item-${Date.now()}`,
              type,
              is_suspended: false,
              is_details_open: false,
            } as ItemData;
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId ? { ...room, items: [...room.items, newItem] } : room
              ),
            }));
            get()._recalculateTotals();
          },

          updateItem: (roomId: string, itemId: string, data: Partial<ItemData>) => {
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
            get()._recalculateTotals();
          },

          deleteItem: (roomId: string, itemId: string) => {
            set((state) => ({
              rooms: state.rooms.map((room) =>
                room.id === roomId
                  ? { ...room, items: room.items.filter((item) => item.id !== itemId) }
                  : room
              ),
            }));
            get()._recalculateTotals();
          },

          duplicateItem: (roomId: string, itemId: string) => {
            set((state) => {
              const room = state.rooms.find((r) => r.id === roomId);
              const itemToCopy = room?.items.find((i) => i.id === itemId);
              if (!room || !itemToCopy) return state;
              const newItem = { ...itemToCopy, id: `item-${Date.now()}` };
              return { rooms: state.rooms.map((r) => (r.id === roomId ? { ...r, items: [...r.items, newItem] } : r)) };
            });
            get()._recalculateTotals();
          },

          changeItemType: (roomId: string, itemId: string, newType: ItemType) => {
            // implement conversion logic if needed
            get()._recalculateTotals();
          },

          // --- Discount ---
          updateDiscount: (newDiscount: DiscountData) => {
            set({ discount: newDiscount });
            get()._recalculateTotals();
          },

          // --- Favorites ---
          addFavorite: (type: string, code: string, price: number) => {
            const newFavorites = addOrUpdateFavorite(get().favorites, type, code, price);
            set({ favorites: newFavorites });
            saveFavoritesToStorage(newFavorites);
          },

          deleteFavorite: (type: string, code: string) => {
            const newFavorites = deleteFavorite(get().favorites, type, code);
            set({ favorites: newFavorites });
            saveFavoritesToStorage(newFavorites);
          },

          // --- Import/Export ---
          loadState: (payload: AppPayload) => {
            const customerPayload = {
              customer_name: payload.customer_name,
              customer_phone: payload.customer_phone,
              customer_address: payload.customer_address,
              customer_card_open: payload.customer_card_open,
            };
            set({
              customer: { ...get().customer, ...customerPayload },
              customer_name: payload.customer_name,
              customer_phone: payload.customer_phone,
              customer_address: payload.customer_address,
              customer_card_open: payload.customer_card_open,
              discount: payload.discount,
              rooms: payload.rooms,
            });
            get()._recalculateTotals();
          },

          importFavorites: (favorites: FavoritesData) => {
            set({ favorites });
            saveFavoritesToStorage(favorites);
          },

          resetState: () => {
            if (!window.confirm('คุณต้องการลบข้อมูลทั้งหมดและเริ่มใหม่?')) return;
            // reset both object and flat fields
            set({
              customer: {
                customer_name: '',
                customer_phone: '',
                customer_address: '',
                customer_card_open: true,
              },
              customer_name: '',
              customer_phone: '',
              customer_address: '',
              customer_card_open: true,
              discount: { type: 'amount', value: 0 },
              rooms: [],
            });
            get()._recalculateTotals();
          },
        }),
        {
          name: STORAGE_KEY,
          version: 1,
          migrate: (persistedState: any, version: number) => {
            return persistedState;
          },
          onRehydrateStorage: () => (state) => {
            // when store rehydrates from storage, recalc totals
            if (state && typeof state._recalculateTotals === 'function') {
              state._recalculateTotals();
            }
          },
        }
      ),
      {
        limit: 10,
        partialize: (state) => {
          // return stable primitives only to avoid selectors seeing new objects
          const stableRooms = state.rooms.map((r) => {
            // only persist essential fields of room/items to keep shape stable
            return {
              id: r.id,
              room_name: r.room_name,
              is_suspended: r.is_suspended,
              // keep items but map minimal fields to avoid frequent object churn
              items: r.items.map((it) => ({ id: it.id, type: it.type, is_suspended: it.is_suspended })),
            };
          });
          return {
            // persist flat customer primitives
            customer_name: state.customer_name,
            customer_phone: state.customer_phone,
            customer_address: state.customer_address,
            customer_card_open: state.customer_card_open,
            rooms: stableRooms,
            discount: state.discount,
          };
        },
      }
    )
  )
);
