CREATE TABLE POSTS (
    PostID        CHAR(10)        PRIMARY KEY,
    Title         NVARCHAR(200)   NOT NULL,
    Content       NVARCHAR(MAX)   NOT NULL,
    CreatedAt     DATETIME        NOT NULL  DEFAULT GETDATE(),
    UserID        CHAR(10)        NOT NULL        -- Foreign Key references to UserID in UserTable table
);
