CREATE TABLE ANSWER (
    -- 1. Hai cột này đóng vai trò là KHÓA NGOẠI (tham chiếu về bảng Câu hỏi)
    TestID              CHAR(10)        NOT NULL,
    QuestionNo          INT             NOT NULL,   -- Tương ứng với "STT câu hỏi" trong lược đồ

    -- 2. Cột này xác định thứ tự câu trả lời (A, B, C, D...)
    AnswerNo            INT             NOT NULL,   -- STT câu trả lời

    -- 3. Thông tin câu trả lời
    AnswerContent       NVARCHAR(MAX)   NOT NULL,   -- Nội dung
    IsCorrect           BIT             NOT NULL DEFAULT 0, -- 1 là Đúng, 0 là Sai

    -- 4. THIẾT LẬP KHÓA CHÍNH (Gồm 3 cột)
    -- Để đảm bảo trong 1 bài test, tại câu hỏi số X, không có 2 câu trả lời cùng số thứ tự Y
    PRIMARY KEY (TestID, QuestionNo, AnswerNo),

    -- 5. THIẾT LẬP KHÓA NGOẠI (Composite Foreign Key)
    -- Tham chiếu cả cặp (TestID, QuestionNo) về bảng cha TestQuestion
    -- CONSTRAINT FK_Answer_Question FOREIGN KEY (TestID, QuestionNo) 
    --     REFERENCES Question(TestID, QuestionNo)
    --     ON DELETE CASCADE -- Tùy chọn: Xóa câu hỏi thì xóa luôn câu trả lời
);