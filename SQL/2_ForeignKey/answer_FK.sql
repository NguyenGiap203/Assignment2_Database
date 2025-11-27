ALTER TABLE ANSWER
ADD CONSTRAINT FK_ANSWER_QUESTION 
FOREIGN KEY (TestID, QuestionNo) REFERENCES QUESTION (TestID, QuestionNo)
ON DELETE CASCADE; -- Tùy chọn: Xóa câu hỏi thì xóa luôn các câu trả lời
