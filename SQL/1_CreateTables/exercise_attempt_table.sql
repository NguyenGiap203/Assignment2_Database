CREATE TABLE EXERCISE_ATTEMPT (
    -- 1. Cột đếm số tự động (Dùng IDENTITY)
    -- Cột này chỉ dùng để đếm, không cần hiển thị ra ngoài nếu không muốn
    AutoID INT IDENTITY(1,1) NOT NULL,

    -- 2. Cột Khóa chính có tiền tố (COMPUTED COLUMN)
    -- Công thức: 'ATT' + Chuỗi số 0 đệm thêm + Số AutoID (cắt lấy 5 ký tự cuối)
    -- Kết quả sẽ là: ATT00001, ATT00002...
    AttemptID AS ('ATT' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,


    UserID              CHAR(10)        NOT NULL,     -- Foreign Key
    ExerciseID          CHAR(10)        NOT NULL,     -- Foreign Key
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       
    Score               DECIMAL(5, 2)   CHECK (Score >= 0 AND Score <= 100),

    -- Định nghĩa AttemptID làm KHÓA CHÍNH
    CONSTRAINT PK_ExerciseAttempt PRIMARY KEY (AttemptID),

    -- Ràng buộc logic
    CONSTRAINT CK_SubmitTime CHECK (SubmitTime >= StartTime)
);

-- DROP TABLE EXERCISE_ATTEMPT;