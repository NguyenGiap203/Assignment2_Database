CREATE TABLE VIDEO_LESSON (
    VideoID         CHAR(10)        PRIMARY KEY,       
    ChapterID       CHAR(10)        NOT NULL,                   -- FOREIGN KEY
    Title           NVARCHAR(200)   NOT NULL,
    VideoURL        NVARCHAR(1000)  NOT NULL,
    DurationMinutes INT             NOT NULL    DEFAULT 0    CHECK (DurationMinutes > 0)
    -- CONSTRAINT FK_Video_Chapter FOREIGN KEY (ChapterID) REFERENCES CHAPTER(ChapterID)   
);
