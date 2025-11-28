CREATE TABLE ANSWER (
    -- 1. Hai cột này đóng vai trò là KHÓA NGOẠI (tham chiếu về bảng Câu hỏi)
    TestID              CHAR(10)        NOT NULL,
    QuestionNo          INT             NOT NULL,   -- Tương ứng với "STT câu hỏi" trong lược đồ

    -- 2. Cột này xác định thứ tự câu trả lời (A, B, C, D...)
    AnswerNo            INT             NOT NULL,   -- STT câu trả lời

    -- 3. Thông tin câu trả lời
    AnswerContent       NVARCHAR(MAX)   NOT NULL,   -- Nội dung
    IsCorrect           BIT             NOT NULL DEFAULT 0, -- 1 là Đúng, 0 là Sai

    -- 4. THIẾT LẬP KHÓA CHÍNH (Gồm 3 cột)
    -- Để đảm bảo trong 1 bài test, tại câu hỏi số X, không có 2 câu trả lời cùng số thứ tự Y
    PRIMARY KEY (TestID, QuestionNo, AnswerNo),

    -- 5. THIẾT LẬP KHÓA NGOẠI (Composite Foreign Key)
    -- Tham chiếu cả cặp (TestID, QuestionNo) về bảng cha TestQuestion
    -- CONSTRAINT FK_Answer_Question FOREIGN KEY (TestID, QuestionNo) 
    --     REFERENCES Question(TestID, QuestionNo)
    --     ON DELETE CASCADE -- Tùy chọn: Xóa câu hỏi thì xóa luôn câu trả lời
);
CREATE TABLE CHAPTER (
    ChapterID               CHAR(10)      PRIMARY KEY,                -- Ma so chuong            
    CourseID                CHAR(10)      NOT NULL,                            -- Ma so Khoa Hoc    FOREIGN KEY
    ChapterTitle            NVARCHAR(200) NOT NULL,
    ChapterOrder            INT           NOT NULL CHECK (ChapterOrder > 0),
    ChapterDescription      NVARCHAR(MAX)
    
);

-- DROP TABLE CHAPTER;
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


CREATE TABLE COURSE_ENROLLMENT (
    UserID          CHAR(10)    NOT NULL, 
    CourseID        CHAR(10)    NOT NULL,
    EnrollmentDate  DATETIME    DEFAULT GETDATE(),      -- automaticly get datetime

    PRIMARY KEY (UserID, CourseID)
);
CREATE TABLE COURSE_RATING ( 
    UserID          CHAR(10)    NOT NULL, 
    CourseID        CHAR(10)     NOT NULL,
    RatingValue     INT         CHECK (RatingValue >= 1 AND RatingValue <= 5), -- Điểm đánh giá (Ví dụ: từ 1 đến 5)
    
    PRIMARY KEY (UserID, CourseID)
);
CREATE TABLE COURSE (
    CourseID            CHAR(10)        PRIMARY KEY,            -- Đã sửa từ 5 lên 10
    CourseName          NVARCHAR(255)   NOT NULL,               -- Đã sửa thành NVARCHAR
    CourseState         NVARCHAR(50)    DEFAULT N'Sắp ra mắt',  -- Đã sửa thành NVARCHAR (ví dụ: 'Đang mở', 'Đã đóng')
    TeacherID           CHAR(10)        NOT NULL,               -- Foreign Key references to TeacherID in Teacher table
    
    TotalDuration       DECIMAL(10, 2)  DEFAULT 0   CHECK (TotalDuration >= 0), 
    NumTests            INT             DEFAULT 0   CHECK (NumTests >= 0), 
    NumTheoryLessons    INT             DEFAULT 0   CHECK (NumTheoryLessons >= 0), 
    NumExercises        INT             DEFAULT 0   CHECK (NumExercises >= 0),
    NumVideos           INT             DEFAULT 0   CHECK (NumVideos >= 0),
    AverageRating       DECIMAL(2, 1)   DEFAULT 0   CHECK (AverageRating >= 0.0 AND AverageRating <= 5.0),
    NumRatings          INT             DEFAULT 0   CHECK (NumRatings >= 0),
    NumStudents         INT             DEFAULT 0   CHECK (NumStudents >= 0), 

    -- Ràng buộc Unique cho tên khóa học
    CONSTRAINT UQ_CourseName UNIQUE(CourseName)
);

-- DROP TABLE COURSE;

CREATE TABLE EXERCISE_ATTEMPT (
    -- 1. Cột đếm số tự động (Dùng IDENTITY)
    -- Cột này chỉ dùng để đếm, không cần hiển thị ra ngoài nếu không muốn
    AutoID INT IDENTITY(1,1) NOT NULL,

    -- 2. Cột Khóa chính có tiền tố (COMPUTED COLUMN)
    -- Công thức: 'ATT' + Chuỗi số 0 đệm thêm + Số AutoID (cắt lấy 5 ký tự cuối)
    -- Kết quả sẽ là: ATT00001, ATT00002...
    AttemptID AS ('ATT' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,


    UserID              CHAR(10)        NOT NULL,     -- Foreign Key
    ExerciseID          CHAR(10)        NOT NULL,     -- Foreign Key
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       
    Score               DECIMAL(4, 2)   CHECK (Score >= 0 AND Score <= 100),

    -- Định nghĩa AttemptID làm KHÓA CHÍNH
    CONSTRAINT PK_ExerciseAttempt PRIMARY KEY (AttemptID),

    -- Ràng buộc logic
    CONSTRAINT CK_SubmitTime CHECK (SubmitTime >= StartTime)
);

-- DROP TABLE EXERCISE_ATTEMPT;
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
CREATE TABLE POSTS (
    PostID        CHAR(10)        PRIMARY KEY,
    Title         NVARCHAR(200)   NOT NULL,
    Content       NVARCHAR(MAX)   NOT NULL,
    CreatedAt     DATETIME        NOT NULL  DEFAULT GETDATE(),
    UserID        CHAR(10)        NOT NULL        -- Foreign Key references to UserID in UserTable table
);
CREATE TABLE PRACTICES (
    PracticeID      CHAR(10)        PRIMARY KEY,
    Title           NVARCHAR(200)   NOT NULL,
    Difficulty      NVARCHAR(50)    NOT NULL,
    Content         NVARCHAR(MAX)   NOT NULL,
    TeacherID       CHAR(10)        NOT NULL      -- Foreign Key references to TeacherID in Teacher table
);
CREATE TABLE PRACTICE_ATTEMPT_INFO (
-- Cột đếm tự động (ẩn)
    AutoID              INT IDENTITY(1,1) NOT NULL,

    -- Cột Khóa chính tính toán: PRA00001, PRA00002...
    PracticeAttemptID   AS ('PRA' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,

    UserID              CHAR(10)        NOT NULL, 
    PracticeID          CHAR(10)        NOT NULL, 
    
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       -- NULL nếu chưa nộp
    Score               INT             CHECK (Score >= 0 AND Score <= 100), -- Điểm số
    
    -- Thiết lập Khóa chính
    CONSTRAINT PK_PracticeAttempt PRIMARY KEY (PracticeAttemptID),

    -- Ràng buộc logic
    CONSTRAINT CK_PracticeAttempt_Time CHECK (SubmitTime >= StartTime)
);
CREATE TABLE QUESTION (
	TestID              CHAR(10)        NOT NULL,       -- Một phần của khóa chính
    QuestionNo          INT             NOT NULL,       -- STT (Một phần của khóa chính)
    
    QuestionContent     NVARCHAR(MAX)   NOT NULL,       -- Nội dung
    Score               INT             DEFAULT 0 CHECK (Score >= 0), -- Số điểm của câu này
    
    -- Thiết lập KHÓA CHÍNH PHỨC HỢP (Composite Primary Key)
    PRIMARY KEY (TestID, QuestionNo)
    
    -- Thiết lập khóa ngoại tham chiếu về Test
    -- CONSTRAINT FK_Question_Test FOREIGN KEY (TestID) REFERENCES Test(TestID)
    --     ON DELETE CASCADE -- Nếu xóa bài kiểm tra, xóa luôn câu hỏi
);
CREATE TABLE TEACHER_EDUCATION (
    EduID               INT             PRIMARY KEY IDENTITY(1,1),  -- Khóa thay thế tự tăng
    TeacherID           CHAR(10)        NOT NULL,    -- Cột này sẽ tham chiếu về GiaoVien
    Degree              NVARCHAR(50)    NOT NULL,           -- Ví dụ: Cử nhân, Thạc sĩ
    Major               NVARCHAR(100)   NOT NULL,      -- Ví dụ: Công nghệ thông tin
    School              NVARCHAR(100)   NOT NULL,           -- Tên trường
    StartTime           DATE,
    EndTime             DATE,

    CONSTRAINT CK_Edu_Time CHECK (EndTime > StartTime)
);

CREATE TABLE TEACHER (
    TeacherID  CHAR(10)    PRIMARY KEY
);
CREATE TABLE TEST_ATTEMPT_RECORDS (
-- Cột đếm số tự động (ẩn)
    AutoID INT IDENTITY(1,1) NOT NULL,

    -- Cột Khóa chính tính toán: TST00001, TST00002...
    TestAttemptID AS ('TST' + RIGHT('00000' + CAST(AutoID AS VARCHAR(10)), 5)) PERSISTED,

    UserID              CHAR(10)        NOT NULL, 
    TestID              CHAR(10)        NOT NULL, 
    
    StartTime           DATETIME        NOT NULL DEFAULT GETDATE(),
    SubmitTime          DATETIME,       -- NULL nếu chưa nộp
    Score               DECIMAL(4, 2)   CHECK (Score >= 0), -- Điểm số
    
    CONSTRAINT PK_TestAttempt PRIMARY KEY (TestAttemptID),
    
    -- Ràng buộc logic: Ngày nộp phải sau ngày bắt đầu
    CONSTRAINT CK_TestAttempt_Time CHECK (SubmitTime >= StartTime)
);
CREATE TABLE TEST (
	TestID			CHAR (10)		PRIMARY KEY,
	TestName		NVARCHAR(200)	NOT NULL,
	TestDuration	INT				NOT NULL	CHECK (TestDuration > 0),
	ScoreToPass		INT				DEFAULT 0	CHECK (ScoreToPass >= 0),
	TotalScore		INT				DEFAULT 0	CHECK (TotalScore >= 0),
	ChapterID		CHAR (10)		NOT NULL		-- Foreign Key to Chapter Table
);
CREATE TABLE THEORY_LESSON (
    TheoryLessonID  CHAR(10)      NOT NULL PRIMARY KEY,
    ChapterID       CHAR(10)      NOT NULL,                 -- FOREIGN KEY
    Title           NVARCHAR(200) NOT NULL,
    Content         NVARCHAR(MAX),
    DurationMinutes INT           NOT NULL DEFAULT 0 CHECK (DurationMinutes >= 0),
    -- CONSTRAINT FK_Theory_Chapter FOREIGN KEY (ChapterID) REFERENCES CHAPTER(ChapterID)
);

-- DROP TABLE THEORY_LESSON;
CREATE TABLE USERTABLE (
    UserID              CHAR(10)        PRIMARY KEY,
    AccountName         VARCHAR(30)     NOT NULL,
    AccountPassword     VARCHAR(128)    NOT NULL,          -- Đã thay đổi để lưu bản băm (hash))
    FullName            NVARCHAR(100)   NOT NULL,         
    Email               VARCHAR(255)    NOT NULL,     
    PhoneNumber         VARCHAR(15),                        
    Nation              NVARCHAR(50),                   
    Province            NVARCHAR(50),                      
    Ward                NVARCHAR(50),                   
    EnrollmentDate      DATE,
    AccountState        BIT             NOT NULL    DEFAULT 1  -- Dùng BIT (1 = Active, 0 = Inactive)

    -- Đặt tên rõ ràng cho các ràng buộc Unique
    CONSTRAINT UQ_AccountName UNIQUE(AccountName),
    CONSTRAINT UQ_Email UNIQUE(Email)
);

-- DROP TABLE UserTable;





CREATE TABLE VIDEO_LESSON (
    VideoID         CHAR(10)        PRIMARY KEY,       
    ChapterID       CHAR(10)        NOT NULL,                   -- FOREIGN KEY
    Title           NVARCHAR(200)   NOT NULL,
    VideoURL        NVARCHAR(1000)  NOT NULL,
    DurationMinutes INT             NOT NULL    DEFAULT 0    CHECK (DurationMinutes > 0)
    -- CONSTRAINT FK_Video_Chapter FOREIGN KEY (ChapterID) REFERENCES CHAPTER(ChapterID)   
);
