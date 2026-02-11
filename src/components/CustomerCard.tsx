// src/components/CustomerCard.tsx
// Fixed: avoid infinite update loop by using shallow selector and correct onToggle handling

import React from 'react';
import { useAppStore } from '../store/store';
import { CustomerData } from '../store/types';
import { UserCircle, CaretDown } from 'phosphor-react';
import { shallow } from 'zustand/shallow';

export const CustomerCard: React.FC = () => {
  // Select primitives and use shallow to avoid returning a new object each render
  const {
    customer_name,
    customer_phone,
    customer_address,
    customer_card_open,
  } = useAppStore(
    (state) => ({
      customer_name: state.customer_name,
      customer_phone: state.customer_phone,
      customer_address: state.customer_address,
      customer_card_open: state.customer_card_open,
    }),
    shallow
  );

  // Select action separately (stable reference)
  const updateCustomer = useAppStore((state) => state.updateCustomer);

  // Update field handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateCustomer({ [name]: value } as Partial<CustomerData>);
  };

  // Use the details element's currentTarget.open to get the true new state
  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const open = e.currentTarget.open;
    updateCustomer({ customer_card_open: open });
  };

  return (
    <details
      className="card"
      id="customer-card"
      open={Boolean(customer_card_open)}
      onToggle={handleToggle}
    >
      <summary>
        <h2>
          <UserCircle size={28} weight="regular" style={{ marginRight: '0.25rem' }} />
          ข้อมูลลูกค้า
        </h2>
        <CaretDown size={24} weight="regular" className="expand-icon" />
      </summary>
      <div className="card-content">
        <form className="form-grid-2" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>
              ชื่อลูกค้า
              <input
                type="text"
                name="customer_name"
                placeholder="เช่น คุณสมชาย รักผ้าม่าน"
                value={customer_name ?? ''}
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
                value={customer_phone ?? ''}
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
                value={customer_address ?? ''}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
        </form>
      </div>
    </details>
  );
};
