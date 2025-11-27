CREATE TABLE PRACTICE_ATTEMPT_INFO (
-- Cột đếm tự động (ẩn)
    AutoID              INT IDENTITY(1,1) NOT NULL,

    -- Cột Khóa chính tính toán: PRA00001, PRA00002...
    PracticeAttemptID   AS ('PRA' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,

    UserID              CHAR(10)        NOT NULL, 
    PracticeID          CHAR(10)        NOT NULL, 
    
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       -- NULL nếu chưa nộp
    Score               INT             CHECK (Score >= 0 AND Score <= 100), -- Điểm số
    
    -- Thiết lập Khóa chính
    CONSTRAINT PK_PracticeAttempt PRIMARY KEY (PracticeAttemptID),

    -- Ràng buộc logic
    CONSTRAINT CK_PracticeAttempt_Time CHECK (SubmitTime >= StartTime)
);
