// src/components/CustomerCard.tsx
import React from 'react';
import { useAppStore } from '../store/store';

export function CustomerCard() {
  console.log('Rendering CustomerCard'); // (สำหรับ Debug)

  // --- วิธแก้ไขที่ 1: ดึงข้อมูลทีละตัว (Atomic Selection) ---
  const name = useAppStore(state => state.customer.customer_name);
  const phone = useAppStore(state => state.customer.customer_phone);
  const address = useAppStore(state => state.customer.customer_address);
  const isOpen = useAppStore(state => state.customer.customer_card_open);

  // ดึง Actions (Actions จะคงที่เสมอ ไม่ทำให้ re-render)
  const updateCustomer = useAppStore(state => state.updateCustomer);
  const toggleCustomerCard = useAppStore(state => state.toggleCustomerCard);

  // สร้างฟังก์ชันสำหรับ <summary> เพื่อป้องกัน re-render จาก event
  const handleToggle = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault(); // ป้องกันพฤติกรรม default ของ <details>
    toggleCustomerCard(); // เรียก action จาก store
  };

  return (
    <details className="card" id="customerDetailsCard" open={isOpen}>
      <summary onClick={handleToggle}>
        <h2>
          <i className="ph-bold ph-user-circle"></i>
          ข้อมูลลูกค้า
        </h2>
        <i className="ph-bold ph-caret-down expand-icon"></i>
      </summary>
      <div className="card-content" id="customerInfo">
        <div className="form-grid-2">
          <div className="form-group">
            <label>ชื่อลูกค้า
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                placeholder="ระบุชื่อ"
                value={name}
                onChange={e => updateCustomer('customer_name', e.target.value)}
              />
            </label>
          </div>
          <div className="form-group">
            <label>เบอร์โทรศัพท์
              <input
                type="tel"
                id="customer_phone"
                name="customer_phone"
                placeholder="ระบุเบอร์โทร"
                value={phone}
                onChange={e => updateCustomer('customer_phone', e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>ที่อยู่
            <textarea
              id="customer_address"
              name="customer_address"
              placeholder="ระบุที่อยู่"
              rows={2}
              value={address}
              onChange={e => updateCustomer('customer_address', e.target.value)}
            />
          </label>
        </div>
      </div>
    </details>
  );
}