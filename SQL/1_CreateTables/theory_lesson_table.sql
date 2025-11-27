CREATE TABLE THEORY_LESSON (
    TheoryLessonID  CHAR(10)      NOT NULL PRIMARY KEY,
    ChapterID       CHAR(10)      NOT NULL,                 -- FOREIGN KEY
    Title           NVARCHAR(200) NOT NULL,
    Content         NVARCHAR(MAX),
    DurationMinutes INT           NOT NULL DEFAULT 0 CHECK (DurationMinutes >= 0),
    -- CONSTRAINT FK_Theory_Chapter FOREIGN KEY (ChapterID) REFERENCES CHAPTER(ChapterID)
);

--DROP TABLE THEORY_LESSON;
