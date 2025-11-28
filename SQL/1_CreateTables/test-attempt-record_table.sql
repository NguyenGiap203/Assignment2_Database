CREATE TABLE TEST_ATTEMPT_RECORDS (
-- Cột đếm số tự động (ẩn)
    AutoID INT IDENTITY(1,1) NOT NULL,

    -- Cột Khóa chính tính toán: TST00001, TST00002...
    TestAttemptID AS ('TST' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,

    UserID              CHAR(10)        NOT NULL, 
    TestID              CHAR(10)        NOT NULL, 
    
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       -- NULL nếu chưa nộp
    Score               DECIMAL(4, 2)   CHECK (Score >= 0), -- Điểm số
    
    CONSTRAINT PK_TestAttempt PRIMARY KEY (TestAttemptID),
    
    -- Ràng buộc logic: Ngày nộp phải sau ngày bắt đầu
    CONSTRAINT CK_TestAttempt_Time CHECK (SubmitTime >= StartTime)
);

ALTER TABLE TEST_ATTEMPT_RECORDS
ALTER COLUMN Score DECIMAL(5, 2);
