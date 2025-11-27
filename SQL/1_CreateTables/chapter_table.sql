CREATE TABLE CHAPTER (
    ChapterID               CHAR(10)      PRIMARY KEY,                -- Ma so chuong            
    CourseID                CHAR(10)      NOT NULL,                            -- Ma so Khoa Hoc    FOREIGN KEY
    ChapterTitle            NVARCHAR(200) NOT NULL,
    ChapterOrder            INT           NOT NULL CHECK (ChapterOrder > 0),
    ChapterDescription      NVARCHAR(MAX)
    
);

-- DROP TABLE CHAPTER;
