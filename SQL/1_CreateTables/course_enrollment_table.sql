CREATE TABLE COURSE_ENROLLMENT (
    UserID          CHAR(10)    NOT NULL, 
    CourseID        CHAR(10)    NOT NULL,
    EnrollmentDate  DATETIME    DEFAULT GETDATE(),      -- automaticly get datetime

    PRIMARY KEY (UserID, CourseID)
);