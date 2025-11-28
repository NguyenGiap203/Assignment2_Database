//--------------------------------------------------------
// db.js – FULL REALISTIC DATABASE FOR LMS ADMIN PANEL (WITH TEST QUESTIONS)
//--------------------------------------------------------

const DB_KEYS = {
  users: "app_users",
  courses: "app_courses",
  chapters: "app_chapters",
  videos: "app_videos",
  enrollments: "app_enrollments",
  reviews: "app_reviews",

  practices: "app_practices",
  practicesCompleted: "app_practices_completed",

  exercises: "app_exercises",
  exercisesCompleted: "app_exercises_completed",

  tests: "app_tests",
  testsCompleted: "app_tests_completed",

  // NEW: test questions + answers
  testQuestions: "app_test_questions",
  testAnswers: "app_test_answers",

  posts: "app_posts",
  comments: "app_comments"
};

// -------------------------------------------------------
// Helper Functions
// -------------------------------------------------------
function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function write(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function pad(num, width = 4) {
  return String(num).padStart(width, "0");
}

function nextId(prefix, storageKey) {
  const arr = read(storageKey);
  if (arr.length === 0) return `${prefix}0001`;

  let max = 0;
  arr.forEach(item => {
    const n = parseInt((item.id || "").replace(/\D/g, "")) || 0;
    if (n > max) max = n;
  });

  return prefix + pad(max + 1, 4);
}

// -------------------------------------------------------
// INITIAL SEED
// -------------------------------------------------------
(function seed() {

  //-----------------------------------------------------
  // USERS — 2 user + 1 teacher
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.users)) {
    write(DB_KEYS.users, [
      {
        id: "USR0001",
        username: "alice",
        password: "123",
        fullname: "Alice Nguyen",
        email: "alice@example.com",
        phone: "0123456789",
        province: "TP HCM",
        status: "active",
        role: "normal",
        joinedDate: "2024-10-01"
      },
      {
        id: "USR0002",
        username: "bob",
        password: "123",
        fullname: "Bob Tran",
        email: "bob@example.com",
        phone: "0987654321",
        province: "Hà Nội",
        status: "active",
        role: "normal",
        joinedDate: "2025-02-14"
      },
      {
        id: "USR0003",
        username: "linh",
        password: "123",
        fullname: "Linh Vu",
        email: "linh@example.com",
        phone: "0912345678",
        province: "Đà Nẵng",
        status: "active",
        role: "teacher",
        joinedDate: "2024-12-20"
      }
    ]);
  }

  //-----------------------------------------------------
  // COURSES — mỗi khóa chỉ 1 giáo viên (USR0003)
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.courses)) {
    write(DB_KEYS.courses, [
      {
        id: "CRS0001",
        title: "JavaScript cơ bản",
        description: "Khóa học JS nền tảng cho người mới.",
        createdBy: "USR0003",
        status: "active",
        totalDuration: 28,
        numVideos: 6,
        numPractices: 4,
        participants: 2
      },
      {
        id: "CRS0002",
        title: "SQL thực hành",
        description: "Khóa học SQL thực tế, làm việc với database.",
        createdBy: "USR0003",
        status: "active",
        totalDuration: 20,
        numVideos: 5,
        numPractices: 3,
        participants: 1
      }
    ]);
  }

  //-----------------------------------------------------
  // CHAPTERS
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.chapters)) {
    write(DB_KEYS.chapters, [
      { id: "CHP0001", courseId: "CRS0001", title: "Giới thiệu", numVideos: 2, numPractices: 1 },
      { id: "CHP0002", courseId: "CRS0001", title: "Biến & Hàm", numVideos: 2, numPractices: 2 },
      { id: "CHP0003", courseId: "CRS0002", title: "SQL Cơ bản", numVideos: 2, numPractices: 1 }
    ]);
  }

  //-----------------------------------------------------
  // VIDEOS
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.videos)) {
    write(DB_KEYS.videos, [
      { id: "VID0001", title: "JS Intro", chapterId: "CHP0001", duration: 6 },
      { id: "VID0002", title: "Cài đặt môi trường", chapterId: "CHP0001", duration: 8 },
      { id: "VID0003", title: "Hàm trong JS", chapterId: "CHP0002", duration: 7 },

      { id: "VID0004", title: "Giới thiệu SQL", chapterId: "CHP0003", duration: 6 },
      { id: "VID0005", title: "SELECT cơ bản", chapterId: "CHP0003", duration: 7 }
    ]);
  }

  //-----------------------------------------------------
  // ENROLLMENTS (tham gia khóa học)
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.enrollments)) {
    write(DB_KEYS.enrollments, [
      // CRS0001
      { id: "ENR0001", courseId: "CRS0001", userId: "USR0001", joinedAt: "2025-07-01", isCompleted: true },
      { id: "ENR0002", courseId: "CRS0001", userId: "USR0002", joinedAt: "2025-07-02", isCompleted: false },

      // CRS0002
      { id: "ENR0003", courseId: "CRS0002", userId: "USR0001", joinedAt: "2025-07-10", isCompleted: false },
      { id: "ENR0004", courseId: "CRS0002", userId: "USR0002", joinedAt: "2025-07-12", isCompleted: true }
    ]);
  }

  //-----------------------------------------------------
  // REVIEWS — đánh giá khóa học
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.reviews)) {
    write(DB_KEYS.reviews, [
      // CRS0001
      { id: "REV0001", courseId: "CRS0001", userId: "USR0001", rating: 5, comment: "Khóa này cực dễ hiểu!", createdAt: "2025-07-02" },
      { id: "REV0002", courseId: "CRS0001", userId: "USR0002", rating: 4, comment: "Giảng viên dạy tốt", createdAt: "2025-07-06" },
      { id: "REV0003", courseId: "CRS0001", userId: "USR0003", rating: 4, comment: "Bài tập hợp lý", createdAt: "2025-07-07" },

      // CRS0002
      { id: "REV0004", courseId: "CRS0002", userId: "USR0001", rating: 5, comment: "SQL quá hay", createdAt: "2025-07-10" },
      { id: "REV0005", courseId: "CRS0002", userId: "USR0002", rating: 3, comment: "Hơi khó với người mới", createdAt: "2025-07-11" }
    ]);
  }

  //-----------------------------------------------------
  // PRACTICES — bài luyện tập độc lập
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.practices)) {
    write(DB_KEYS.practices, [
      {
        id: "PRA0001",
        title: "Sắp xếp chuỗi",
        description: "Viết hàm sắp xếp chữ theo bảng chữ cái.",
        difficulty: "Medium",
        status: "active",
        createdBy: "USR0003"
      },
      {
        id: "PRA0002",
        title: "Đệ quy cơ bản",
        description: "Viết hàm tính giai thừa bằng đệ quy.",
        difficulty: "Easy",
        status: "active",
        createdBy: "USR0003"
      }
    ]);
  }

  //-----------------------------------------------------
  // PRACTICES COMPLETED
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.practicesCompleted)) {
    write(DB_KEYS.practicesCompleted, [
      // PRA0001
      { id: "PCM0001", practiceId: "PRA0001", userId: "USR0001", startAt: "2025-07-02 09:10", completedAt: "2025-07-02 09:25", score: 88 },
      { id: "PCM0002", practiceId: "PRA0001", userId: "USR0002", startAt: "2025-07-05 10:00", completedAt: "2025-07-05 10:40", score: 74 },

      // PRA0002
      { id: "PCM0003", practiceId: "PRA0002", userId: "USR0001", startAt: "2025-07-08 08:00", completedAt: "2025-07-08 08:20", score: 95 },
      { id: "PCM0004", practiceId: "PRA0002", userId: "USR0002", startAt: "2025-07-08 09:00", completedAt: null, score: null }
    ]);
  }

  //-----------------------------------------------------
  // EXERCISES — bài tập thuộc chương
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.exercises)) {
    write(DB_KEYS.exercises, [
      {
        id: "EXR0001",
        title: "Bài tập JS 1",
        description: "Viết hàm đảo chuỗi.",
        difficulty: "Medium",
        chapterId: "CHP0002",
        createdBy: "USR0003",
        status: "active"
      },
      {
        id: "EXR0002",
        title: "Bài tập SQL 1",
        description: "Viết truy vấn SELECT với điều kiện.",
        difficulty: "Easy",
        chapterId: "CHP0003",
        createdBy: "USR0003",
        status: "active"
      }
    ]);
  }

  //-----------------------------------------------------
  // EXERCISES COMPLETED
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.exercisesCompleted)) {
    write(DB_KEYS.exercisesCompleted, [
      { id: "ECR0001", exerciseId: "EXR0001", userId: "USR0001", startAt: "2025-07-03 08:00", completedAt: "2025-07-03 09:00", score: 90 },
      { id: "ECR0002", exerciseId: "EXR0001", userId: "USR0002", startAt: "2025-07-03 09:20", completedAt: "2025-07-03 10:00", score: 70 },

      { id: "ECR0003", exerciseId: "EXR0002", userId: "USR0001", startAt: "2025-07-06 14:10", completedAt: "2025-07-06 14:50", score: 92 }
    ]);
  }

  //-----------------------------------------------------
  // TESTS — mỗi chương đúng 1 bài kiểm tra
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.tests)) {
    write(DB_KEYS.tests, [
      {
        id: "TST0001",
        chapterId: "CHP0001",
        title: "Test chương 1",
        description: "Kiểm tra kiến thức nhập môn JS.",
        status: "active"
      },
      {
        id: "TST0002",
        chapterId: "CHP0002",
        title: "Test chương 2",
        description: "Kiến thức về biến và hàm.",
        status: "active"
      }
    ]);
  }

  //-----------------------------------------------------
  // TESTS COMPLETED
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.testsCompleted)) {
    write(DB_KEYS.testsCompleted, [
      { id: "TCM0001", testId: "TST0001", userId: "USR0001", score: 85, completedAt: "2025-07-02" },
      { id: "TCM0002", testId: "TST0001", userId: "USR0002", score: 80, completedAt: "2025-07-03" },
      { id: "TCM0003", testId: "TST0002", userId: "USR0001", score: 88, completedAt: "2025-07-10" }
    ]);
  }

  //-----------------------------------------------------
  // NEW: TEST QUESTIONS
  // Each question belongs to a testId
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.testQuestions)) {
    write(DB_KEYS.testQuestions, [
      // Questions for TST0001 (chapter 1)
      { id: "QST0001", testId: "TST0001", content: "JavaScript là gì?" },
      { id: "QST0002", testId: "TST0001", content: "Cách khai báo biến trong JS?" },

      // Questions for TST0002 (chapter 2)
      { id: "QST0003", testId: "TST0002", content: "Hàm là gì?" },
      { id: "QST0004", testId: "TST0002", content: "Khái niệm closure?" }
    ]);
  }

  //-----------------------------------------------------
  // NEW: TEST ANSWERS
  // Each answer belongs to a questionId; isCorrect boolean
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.testAnswers)) {
    write(DB_KEYS.testAnswers, [
      // Answers for QST0001
      { id: "ANS0001", questionId: "QST0001", content: "Ngôn ngữ lập trình", isCorrect: true },
      { id: "ANS0002", questionId: "QST0001", content: "Một framework", isCorrect: false },
      { id: "ANS0003", questionId: "QST0001", content: "Một thuật toán", isCorrect: false },

      // Answers for QST0002
      { id: "ANS0004", questionId: "QST0002", content: "var / let / const", isCorrect: true },
      { id: "ANS0005", questionId: "QST0002", content: "function", isCorrect: false },
      { id: "ANS0006", questionId: "QST0002", content: "class", isCorrect: false },

      // Answers for QST0003
      { id: "ANS0007", questionId: "QST0003", content: "Block code tái sử dụng", isCorrect: true },
      { id: "ANS0008", questionId: "QST0003", content: "Một biến", isCorrect: false },
      { id: "ANS0009", questionId: "QST0003", content: "Một event", isCorrect: false },

      // Answers for QST0004
      { id: "ANS0010", questionId: "QST0004", content: "Hàm nhớ trạng thái từ scope bên ngoài", isCorrect: true },
      { id: "ANS0011", questionId: "QST0004", content: "Một kiểu dữ liệu", isCorrect: false },
      { id: "ANS0012", questionId: "QST0004", content: "Đóng gói dữ liệu", isCorrect: false }
    ]);
  }

  //-----------------------------------------------------
  // POSTS — bài chia sẻ
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.posts)) {
    write(DB_KEYS.posts, [
      {
        id: "PST0001",
        title: "Kinh nghiệm học JS",
        content: "Đây là chia sẻ kinh nghiệm học JS của mình...",
        authorId: "USR0001",
        createdAt: "2025-05-20",
        status: "active"
      }
    ]);
  }

  //-----------------------------------------------------
  // COMMENTS — bình luận bài chia sẻ
  //-----------------------------------------------------
  if (!localStorage.getItem(DB_KEYS.comments)) {
    write(DB_KEYS.comments, [
      {
        id: "CMT0001",
        userId: "USR0001",
        content: "Bài viết quá hay!",
        parentCommentId: null,
        targetType: "post",
        targetId: "PST0001",
        createdAt: "2025-05-21"
      },
      {
        id: "CMT0002",
        userId: "USR0002",
        content: "Mình mới học phần DOM nên hơi khó.",
        parentCommentId: null,
        targetType: "post",
        targetId: "PST0001",
        createdAt: "2025-05-22"
      },
      {
        id: "CMT0003",
        userId: "USR0001",
        content: "Bạn thử xem lại chương 1 xem nhé!",
        parentCommentId: "CMT0002",
        targetType: "post",
        targetId: "PST0001",
        createdAt: "2025-05-22"
      },
      {
        id: "CMT0004",
        userId: "USR0003",
        content: "Cảm ơn bạn đã chia sẻ!",
        parentCommentId: "CMT0001",
        targetType: "post",
        targetId: "PST0001",
        createdAt: "2025-05-23"
      }
    ]);
  }

})();
