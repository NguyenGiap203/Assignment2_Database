-- Liên kết bảng TEACHER với bảng USERTABLE
-- Ý nghĩa: TeacherID chính là UserID. Một người phải là User trước khi được làm Teacher.
ALTER TABLE TEACHER
ADD CONSTRAINT FK_TEACHER_USERTABLE
FOREIGN KEY (TeacherID) REFERENCES USERTABLE(UserID)
ON DELETE CASCADE; -- Tùy chọn: Nếu xóa User thì xóa luôn tư cách Teacher của họ