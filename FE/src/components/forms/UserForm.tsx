// components/forms/UserForm.tsx

import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { isValidEmail } from '../../utils/validation';

interface UserFormProps {
  initialData?: User; // Dữ liệu người dùng để EDIT (nếu có)
  isSubmitting: boolean;
  onSubmit: (data: User) => void;
  onCancel: () => void;
}

// Giả định kiểu dữ liệu User cơ bản cần cho Form
interface User {
  UserID: string;
  FullName: string;
  Email: string;
  Role: 'Admin' | 'Teacher' | 'Student';
  PhoneNumber: string;
  AccountState: boolean;
  EnrollmentDate: string;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, isSubmitting, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<User>(initialData || {
    UserID: '',
    FullName: '',
    Email: '',
    Role: 'Student',
    PhoneNumber: '',
    AccountState: true,
    EnrollmentDate: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Nếu là form EDIT, lấy dữ liệu gốc
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
    // Xóa lỗi ngay khi người dùng nhập lại
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    let isValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.FullName.trim()) {
      newErrors.FullName = 'Họ tên không được để trống.';
      isValid = false;
    }
    if (!isValidEmail(formData.Email)) {
      newErrors.Email = 'Địa chỉ email không hợp lệ.';
      isValid = false;
    }
    // Thêm các validation khác cho Số điện thoại, ID, v.v.

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
        {initialData ? `Cập nhật người dùng: ${initialData.FullName}` : 'Tạo người dùng mới'}
      </h3>

      <Input
        label="Họ tên"
        name="FullName"
        value={formData.FullName}
        onChange={handleChange}
        error={errors.FullName}
        required
      />
      <Input
        label="Email"
        name="Email"
        type="email"
        value={formData.Email}
        onChange={handleChange}
        error={errors.Email}
        required
      />
      
      {/* Chọn Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
        <select
          name="Role"
          value={formData.Role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-colors focus:outline-none focus:border-blue-500"
        >
          <option value="Student">Học viên</option>
          <option value="Teacher">Giảng viên</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      {/* Checkbox Trạng thái (Admin được sửa) */}
      <div className="flex items-center pt-2">
        <input
          id="accountState"
          name="AccountState"
          type="checkbox"
          checked={formData.AccountState}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="accountState" className="ml-2 text-sm font-medium text-gray-700">
          Kích hoạt tài khoản (Active/Ban)
        </label>
      </div>

      {/* Footer buttons */}
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