// src/components/forms/CourseForm.tsx

import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

// Interface dữ liệu gửi lên API (khớp với CreateCourseRequest trong Backend)
export interface CreateCourseData {
  courseName: string;
  courseState: string;
  teacherID: string;
}

interface CourseFormProps {
  isSubmitting: boolean;
  onSubmit: (data: CreateCourseData) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ isSubmitting, onSubmit, onCancel }) => {
  // Giá trị mặc định
  const [formData, setFormData] = useState<CreateCourseData>({
    courseName: '',
    courseState: 'Sắp ra mắt', // Giá trị mặc định an toàn
    teacherID: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Xóa lỗi khi nhập
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Tên khóa học không được để trống.';
      isValid = false;
    }
    if (!formData.teacherID.trim()) {
      newErrors.teacherID = 'ID Giảng viên không được để trống.';
      isValid = false;
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
      <Input
        label="Tên khóa học"
        name="courseName"
        value={formData.courseName}
        onChange={handleChange}
        error={errors.courseName}
        placeholder="Ví dụ: Lập trình C# căn bản"
        required
      />

      <Input
        label="ID Giảng viên"
        name="teacherID"
        value={formData.teacherID}
        onChange={handleChange}
        error={errors.teacherID}
        placeholder="Ví dụ: USR002"
        required
      />
      {/* Ghi chú: Trong thực tế, nên dùng Dropdown/Select để chọn GV từ danh sách có sẵn */}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
        <select
          name="courseState"
          value={formData.courseState}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="Sắp ra mắt">Sắp ra mắt</option>
          <option value="Đang mở">Đang mở</option>
          <option value="Đã đóng">Đã đóng</option>
        </select>
      </div>

      <div className="flex justify-end pt-4 space-x-3 border-t mt-4">
        <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : 'Tạo khóa học'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;