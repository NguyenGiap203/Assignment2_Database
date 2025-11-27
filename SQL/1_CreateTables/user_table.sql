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





