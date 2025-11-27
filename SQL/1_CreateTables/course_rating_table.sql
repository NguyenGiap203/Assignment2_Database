CREATE TABLE COURSE_RATING ( 
    UserID          CHAR(10)    NOT NULL, 
    CourseID        CHAR(10)     NOT NULL,
    RatingValue     INT         CHECK (RatingValue >= 1 AND RatingValue <= 5), -- Điểm đánh giá (Ví dụ: từ 1 đến 5)
    
    PRIMARY KEY (UserID, CourseID)
);