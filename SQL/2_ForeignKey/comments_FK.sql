-- 1. Người viết bình luận
ALTER TABLE COMMENTS
ADD CONSTRAINT FK_COMMENTS_USERTABLE
FOREIGN KEY (UserID) REFERENCES USERTABLE(UserID);

-- 2. Bình luận thuộc về Bài viết (Post)
ALTER TABLE COMMENTS
ADD CONSTRAINT FK_Comments_Post FOREIGN KEY (PostID)
REFERENCES POSTS(PostID);

-- 3. Bình luận thuộc về Khóa học (Course)
ALTER TABLE COMMENTS
ADD CONSTRAINT FK_COMMENTS_COURSE 
FOREIGN KEY (CourseID) REFERENCES COURSE(CourseID);

-- 4. Bình luận trả lời (Reply) - Tham chiếu về chính bảng COMMENTS
-- Vì khóa chính của COMMENTS là cặp (UserID, CreatedAt)
-- Nên khóa ngoại cũng phải tham chiếu đủ cả cặp này
ALTER TABLE COMMENTS
ADD CONSTRAINT FK_COMMENTS_REPLYTOCOMMENTS 
FOREIGN KEY (ReplyUserID, ReplyCreatedAt) REFERENCES COMMENTS(UserID, CreatedAt);





