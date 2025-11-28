CREATE TABLE PRACTICES (
    PracticeID      CHAR(10)        PRIMARY KEY,
    Title           NVARCHAR(200)   NOT NULL,
    Difficulty      NVARCHAR(50)    NOT NULL,
    Content         NVARCHAR(MAX)   NOT NULL,
    TeacherID       CHAR(10)        NOT NULL      -- Foreign Key references to TeacherID in Teacher table
);
