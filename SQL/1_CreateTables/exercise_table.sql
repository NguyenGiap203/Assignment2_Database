CREATE TABLE EXERCISE (
    ExerciseID          CHAR(10)        NOT NULL PRIMARY KEY,
    ChapterID           CHAR(10)        NOT NULL,       -- Foreign Key
    Title               NVARCHAR(200)   NOT NULL,
    ExDescription       NVARCHAR(MAX)   NOT NULL,
    SampleAnswer        NVARCHAR(MAX)   NOT NULL,
    MinPassingScore     INT             NOT NULL CHECK (MinPassingScore >= 0 AND MinPassingScore <= 100),
    -- MaxScore            INT            NOT NULL CHECK (MaxScore >= 0 AND MaxScore <= 100),

    -- CONSTRAINT FK_Exercise_Chapter FOREIGN KEY (ChapterID) REFERENCES dbo.CHAPTER(ChapterID),
    -- CONSTRAINT CHK_Exercise_Score CHECK (MaxScore >= MinPassingScore)
);
