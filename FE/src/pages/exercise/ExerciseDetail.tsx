// pages/exercise/ExerciseDetail.tsx

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Button from '../../components/ui/Button';
import { ArrowLeft, Edit2, Trash2, CheckCircle } from 'lucide-react';
// import { useParams } from 'react-router-dom'; // Dùng để lấy AttemptID

const ExerciseDetail: React.FC = () => {
  // const { attemptId } = useParams(); // Giả định lấy ID từ URL
  const mockAttemptId = 'ATT00001';

  // Giả lập dữ liệu chi tiết lần làm bài
  const attemptDetail = {
    ExerciseTitle: "Thực hành Component State",
    CourseName: "Lập trình React cơ bản",
    UserName: "Phạm Minh C",
    UserID: 'USR00003',
    Score: 85.5,
    Status: 'Passed',
    SubmitTime: '2024-03-15 10:45:30',
    MinPassingScore: 70,
    StudentAnswer: `
      Sử dụng hook useState để quản lý state nội bộ của component. 
      Tạo hàm handleIncrement để gọi setState, đảm bảo React re-render component 
      và cập nhật giá trị hiển thị trên màn hình. Code hoạt động tốt.
    `,
    SampleAnswer: `
      State nên được khởi tạo bằng useState({...}) ở đầu component. 
      Để cập nhật state, luôn dùng hàm setter (ví dụ: setCount(count + 1)). 
      Nên tránh sửa đổi state trực tiếp.
    `,
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết Bài làm: {mockAttemptId}</h1>
        <Button variant="secondary" onClick={() => window.history.back()}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quay lại lịch sử
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột thông tin chung */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-full">
            <h2 className="text-xl font-semibold border-b pb-3 mb-4 text-blue-600">Tóm tắt</h2>
            <div className="space-y-3">
                <p><span className="font-medium">Bài tập:</span> {attemptDetail.ExerciseTitle}</p>
                <p><span className="font-medium">Khóa học:</span> {attemptDetail.CourseName}</p>
                <p><span className="font-medium">Học viên:</span> {attemptDetail.UserName} ({attemptDetail.UserID})</p>
                <p><span className="font-medium">Thời gian nộp:</span> {attemptDetail.SubmitTime}</p>
                <p className="text-2xl pt-2">
                    <span className="font-medium">Điểm số:</span> 
                    <span className={`ml-2 font-bold ${attemptDetail.Status === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                        {attemptDetail.Score}/100
                    </span>
                </p>
                
                {/* Hành động Admin */}
                <div className="pt-4 border-t mt-4 space-y-2">
                    <p className="font-medium text-gray-700">Quyền hạn Admin:</p>
                    <Button variant="secondary" size="sm" className="w-full justify-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Sửa Trạng thái (Thủ công)
                    </Button>
                    <Button variant="danger" size="sm" className="w-full justify-center">
                        <Trash2 className="w-4 h-4 mr-1" /> Xóa Bài làm này
                    </Button>
                </div>
            </div>
        </div>

        {/* Cột chi tiết bài làm */}
        <div className="lg:col-span-2 space-y-6">
            {/* Bài làm của học viên */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                <h2 className="text-xl font-semibold mb-4">Bài làm của Học viên</h2>
                <div className="whitespace-pre-wrap p-4 bg-gray-50 border rounded-lg text-sm font-mono">
                    {attemptDetail.StudentAnswer}
                </div>
            </div>

            {/* Bài làm mẫu (Admin chỉ xem) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-semibold mb-4">Bài làm mẫu / Đáp án</h2>
                    <Button variant="ghost" size="sm" className='text-sm'>
                        <Edit2 className="w-4 h-4 mr-1" /> Sửa Nội dung (Dành cho Super Admin)
                    </Button>
                </div>
                
                <div className="whitespace-pre-wrap p-4 bg-gray-50 border rounded-lg text-sm font-mono">
                    {attemptDetail.SampleAnswer}
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExerciseDetail;