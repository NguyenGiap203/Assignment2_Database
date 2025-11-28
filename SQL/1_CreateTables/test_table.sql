CREATE TABLE TEST (
	TestID			CHAR (10)		PRIMARY KEY,
	TestName		NVARCHAR(200)	NOT NULL,
	TestDuration	INT				NOT NULL	CHECK (TestDuration > 0),
	ScoreToPass		INT				DEFAULT 0	CHECK (ScoreToPass >= 0),
	TotalScore		INT				DEFAULT 0	CHECK (TotalScore >= 0),
	ChapterID		CHAR (10)		NOT NULL		-- Foreign Key to Chapter Table
);