// src/components/CustomerCard.tsx
// [NEW] คอมโพเนนต์สำหรับแสดงและแก้ไขข้อมูลลูกค้า
// (แทนที่ <template id="customer-card-template"> และ ui.js)

import React from 'react';
import { useAppStore } from '../store/store';
import { CustomerData } from '../store/types';
import { UserCircle, CaretDown } from 'phosphor-react';

export const CustomerCard: React.FC = () => {
  // [NEW] เชื่อมต่อกับ Store โดยเลือก (select) เฉพาะ state ที่ต้องการ
  const customerData = useAppStore((state) => ({
    customer_name: state.customer_name,
    customer_phone: state.customer_phone,
    customer_address: state.customer_address,
    customer_card_open: state.customer_card_open,
  }));
  
  // [NEW] ดึง action 'updateCustomer' มาจาก store
  const updateCustomer = useAppStore((state) => state.updateCustomer);

  // [NEW] Handler สำหรับอัปเดตข้อมูลใน store
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateCustomer({ [name]: value } as Partial<CustomerData>);
  };

  // [NEW] Handler สำหรับการพับ/กาง (toggle)
  const handleToggle = () => {
    updateCustomer({ customer_card_open: !customerData.customer_card_open });
  };

  return (
    <details
      className="card"
      id="customer-card" // ID เดิมสำหรับ CSS
      open={customerData.customer_card_open}
      onToggle={handleToggle}
    >
      <summary>
        <h2>
          {/* (ใช้ icon จาก phosphor-react แทน <i>) */}
          <UserCircle size={28} weight="regular" style={{ marginRight: '0.25rem' }} />
          ข้อมูลลูกค้า
        </h2>
        <CaretDown size={24} weight="regular" className="expand-icon" />
      </summary>
      <div className="card-content">
        <form className="form-grid-2">
          <div className="form-group">
            <label>
              ชื่อลูกค้า
              <input
                type="text"
                name="customer_name"
                placeholder="เช่น คุณสมชาย รักผ้าม่าน"
                value={customerData.customer_name}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              เบอร์โทรศัพท์
              <input
                type="tel"
                name="customer_phone"
                placeholder="เช่น 081-234-5678"
                value={customerData.customer_phone}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group full-width-item">
            <label>
              ที่อยู่ / สถานที่ติดตั้ง
              <textarea
                name="customer_address"
                rows={2}
                placeholder="เช่น 123/45 หมู่บ้านม่านสวย..."
                value={customerData.customer_address}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
        </form>
      </div>
    </details>
  );
};