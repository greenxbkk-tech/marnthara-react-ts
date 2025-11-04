// src/components/modals/FavoritesManagerModal.tsx
// [NEW] Modal หลักสำหรับจัดการรายการโปรด

import React, 'react';
import { useAppStore } from '../../store/store';
import { useUIStore } from '../../store/uiStore';
import { FavoritesData } from '../../store/types';
import { ITEM_CONFIG } from '../../lib/config';
import { ModalBase } from './ModalBase';
import { Plus, PencilSimple, Trash } from 'phosphor-react';

// [NEW] แปลงชื่อ Type สำหรับแสดงผล (เช่น 'wooden_blind' -> 'มู่ลี่ไม้')
const getTypeDisplayName = (type: keyof FavoritesData): string => {
  if (type === 'fabric') return 'ผ้าทึบ';
  if (type === 'sheer') return 'ผ้าโปร่ง';
  return ITEM_CONFIG[type]?.name || type;
};

export const FavoritesManagerModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({
  isOpen,
  onClose,
}) => {
  // --- State & Stores ---
  const { favorites, deleteFavorite } = useAppStore((state) => ({
    favorites: state.favorites,
    deleteFavorite: state.deleteFavorite,
  }));
  
  const { openFavFormModal } = useUIStore();

  // [NEW] Local state สำหรับจัดการ UI ภายใน
  const [activeType, setActiveType] = React.useState<keyof FavoritesData>('fabric');
  const [selectedCode, setSelectedCode] = React.useState<string | null>(null);

  const favTypes = Object.keys(favorites) as (keyof FavoritesData)[];
  const activeList = favorites[activeType] || [];
  
  // --- Handlers ---
  const handleSelectType = (type: keyof FavoritesData) => {
    setActiveType(type);
    setSelectedCode(null); // เคลียร์ selection เมื่อเปลี่ยน Tab
  };

  const handleSelectItem = (code: string) => {
    setSelectedCode(code === selectedCode ? null : code); // Toggle select
  };

  const handleAdd = () => {
    openFavFormModal({ mode: 'add', type: activeType });
  };
  
  const handleEdit = () => {
    if (!selectedCode) return;
    const item = activeList.find(f => f.code === selectedCode);
    if (item) {
      openFavFormModal({ mode: 'edit', type: activeType, code: item.code, price: item.price });
    }
  };
  
  const handleDelete = () => {
    if (!selectedCode) return;
    if (window.confirm(`ลบรหัส "${selectedCode}" ออกจาก "${getTypeDisplayName(activeType)}"?`)) {
      deleteFavorite(activeType, selectedCode);
      setSelectedCode(null); // เคลียร์ selection
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="จัดการรายการโปรด" size="lg">
      <div className="fav-manager-container">
        
        {/* 1. แถบเลือกประเภท (Tabs) */}
        <div className="fav-manager-tabs">
          {favTypes.map((type) => (
            <button
              key={type}
              className={`tab-link ${type === activeType ? 'active' : ''}`}
              onClick={() => handleSelectType(type)}
            >
              {getTypeDisplayName(type)}
            </button>
          ))}
        </div>

        {/* 2. เนื้อหา (List) */}
        <div className="fav-manager-content">
          <div className="fav-manager-actions">
            <button className="btn btn-secondary" onClick={handleAdd}>
              <Plus size={16} /> เพิ่มใหม่
            </button>
            <button className="btn btn-secondary" onClick={handleEdit} disabled={!selectedCode}>
              <PencilSimple size={16} /> แก้ไข
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={!selectedCode}>
              <Trash size={16} /> ลบ
            </button>
          </div>
          
          <div className="fav-list-container">
            {activeList.length === 0 ? (
              <p>(ไม่มีรายการในหมวดนี้)</p>
            ) : (
              <table className="fav-list-table">
                <thead>
                  <tr>
                    <th>รหัส (Code)</th>
                    <th>ราคา (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeList.map((fav) => (
                    <tr
                      key={fav.code}
                      className={fav.code === selectedCode ? 'selected' : ''}
                      onClick={() => handleSelectItem(fav.code)}
                    >
                      <td>{fav.code}</td>
                      <td>{fav.price.toLocaleString('th-TH')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ModalBase>
  );
};