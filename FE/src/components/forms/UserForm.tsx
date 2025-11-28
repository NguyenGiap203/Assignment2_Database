// src/components/forms/UserForm.tsx

import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { isValidEmail } from '../../utils/validation';

interface UserFormProps {
  initialData?: User; 
  isSubmitting: boolean;
  onSubmit: (data: User) => void;
  onCancel: () => void;
}

// FIX: Chuyển sang camelCase
interface User {
  userID: string;
  accountName: string;
  accountPassword?: string;
  fullName: string;
  email: string;
  role: string; // Role có thể không có trong DB UserTable
  phoneNumber?: string;
  nation?: string;
  province?: string;
  ward?: string;
  accountState: boolean;
  enrollmentDate: string;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, isSubmitting, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<User>(initialData || {
    userID: '',
    accountName: '',
    accountPassword: '', 
    fullName: '',
    email: '',
    role: 'Student',
    phoneNumber: '',
    nation: '',
    province: '',
    ward: '',
    accountState: true,
    enrollmentDate: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống.';
      isValid = false;
    }
    if (!formData.accountName.trim()) {
        newErrors.accountName = 'Tên tài khoản không được để trống.';
        isValid = false;
    }
    if (!isValidEmail(formData.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ.';
      isValid = false;
    }
    
    // Validate Password khi tạo mới
    if (!initialData) {
        if (!formData.accountPassword?.trim()) {
            newErrors.accountPassword = 'Mật khẩu là bắt buộc.';
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold mb-4 text-blue-600">
        {initialData ? `Cập nhật người dùng: ${initialData.fullName}` : 'Tạo người dùng mới'}
      </h3>

      <Input
        label="Tên tài khoản (Login Name)"
        name="accountName" // FIX: name="accountName"
        value={formData.accountName}
        onChange={handleChange}
        error={errors.accountName}
        required
        disabled={!!initialData} 
      />
      
      {!initialData && (
          <Input
            label="Mật khẩu"
            name="accountPassword" // FIX: name="accountPassword"
            type="password"
            value={formData.accountPassword}
            onChange={handleChange}
            error={errors.accountPassword}
            placeholder="Mật khẩu"
            required
          />
      )}

      <Input
        label="Họ tên"
        name="fullName" // FIX: name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={errors.fullName}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />
      <Input
        label="Số điện thoại"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <Input
        label="Quốc gia"
        name="nation"
        value={formData.nation}
        onChange={handleChange}
      />
      <Input
        label="Tỉnh/Thành phố"
        name="province"
        value={formData.province}
        onChange={handleChange}
      />
      <Input
        label="Quận/Huyện/Phường/Xã"
        name="ward"
        value={formData.ward}
        onChange={handleChange}
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:border-blue-500"
        >
          <option value="Student">Học viên</option>
          <option value="Teacher">Giảng viên</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center pt-2">
        <input
          id="accountState"
          name="accountState" // FIX: name="accountState"
          type="checkbox"
          checked={formData.accountState}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="accountState" className="ml-2 text-sm font-medium text-gray-700">
          Kích hoạt tài khoản (Active/Ban)
        </label>
      </div>

      <div className="flex justify-end pt-4 space-x-3 border-t">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(UserForm);