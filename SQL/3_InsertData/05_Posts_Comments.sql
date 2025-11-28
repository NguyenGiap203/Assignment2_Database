-- 1. POST (4 dòng)
INSERT INTO POSTS (PostID, Title, Content, UserID) VALUES 
('POS01', N'Lộ trình học SQL cho người mới', N'Chia sẻ kinh nghiệm...', 'US003'),
('POS02', N'Làm sao để học từ vựng nhanh?', N'Mẹo học Flashcard...', 'US004'),
('POS03', N'Review khóa học ReactJS', N'Khóa học rất hay...', 'US005'),
('POS04', N'Tìm bạn học nhóm TOEIC', N'Mình cần tìm bạn...', 'US006');

-- 2. COMMENT (4 dòng)
INSERT INTO COMMENTS (UserID, CreatedAt, Content, ReplyCount, PostID) VALUES 
('US004', '2023-11-20 08:00:00', N'Cảm ơn bài chia sẻ hữu ích!', 0, 'POS01'),
('US005', '2023-11-20 09:00:00', N'Mình cũng đang học theo lộ trình này.', 0, 'POS01'),
('US003', '2023-11-21 10:00:00', N'Inbox mình nhé!', 0, 'POS04'),
('US006', '2023-11-21 11:00:00', N'Bài viết rất chi tiết.', 0, 'POS02');

-- SELECT * FROM POSTS;
-- SELECT * FROM COMMENTS;