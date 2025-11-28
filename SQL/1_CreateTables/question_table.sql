CREATE TABLE QUESTION (
	TestID              CHAR(10)        NOT NULL,       -- Một phần của khóa chính
    QuestionNo          INT             NOT NULL,       -- STT (Một phần của khóa chính)
    
    QuestionContent     NVARCHAR(MAX)   NOT NULL,       -- Nội dung
    Score               INT             DEFAULT 0 CHECK (Score >= 0), -- Số điểm của câu này
    
    -- Thiết lập KHÓA CHÍNH PHỨC HỢP (Composite Primary Key)
    PRIMARY KEY (TestID, QuestionNo)
    
    -- Thiết lập khóa ngoại tham chiếu về Test
    -- CONSTRAINT FK_Question_Test FOREIGN KEY (TestID) REFERENCES Test(TestID)
    --     ON DELETE CASCADE -- Nếu xóa bài kiểm tra, xóa luôn câu hỏi
);