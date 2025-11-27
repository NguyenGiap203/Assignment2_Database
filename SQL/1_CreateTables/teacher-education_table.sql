CREATE TABLE TEACHER_EDUCATION (
    EduID               INT             PRIMARY KEY IDENTITY(1,1),  -- Khóa thay thế tự tăng
    TeacherID           CHAR(10)        NOT NULL,    -- Cột này sẽ tham chiếu về GiaoVien
    Degree              NVARCHAR(50)    NOT NULL,           -- Ví dụ: Cử nhân, Thạc sĩ
    Major               NVARCHAR(100)   NOT NULL,      -- Ví dụ: Công nghệ thông tin
    School              NVARCHAR(100)   NOT NULL,           -- Tên trường
    StartTime           DATE,
    EndTime             DATE,

    CONSTRAINT CK_Edu_Time CHECK (EndTime > StartTime)
);

