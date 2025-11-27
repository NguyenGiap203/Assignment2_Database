CREATE TABLE COMMENTS (
    UserID				CHAR(10)       NOT NULL,            -- Foreign Key references to UserID in UserTable table
    CreatedAt           DATETIME       NOT NULL DEFAULT GETDATE(),
    Content             NVARCHAR(MAX)  NOT NULL,
    ReplyCount          INT            NOT NULL DEFAULT 0   CHECK (ReplyCount >= 0),

    ReplyUserID			CHAR(10)       NULL,                -- Foreign Key references to UserID in COMMENTS table
    ReplyCreatedAt      DATETIME       NULL,                -- Foreign Key references to CreatedAt in COMMENTS table

    PostID              CHAR(10)       NULL,                -- Foreign Key references to PostID in POST table
    CourseID            CHAR(10)       NULL,                -- Foreign Key references to CourseID in Course table

	PRIMARY KEY (UserID, CreatedAt)
);


