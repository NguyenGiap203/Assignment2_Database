# 📖 API DOCUMENTATION - Hướng dẫn tích hợp Backend cho Team Frontend

## 📋 Mục lục
- [Thông tin Backend](#-thông-tin-backend)
- [Cách chạy & Test](#-cách-chạy--test)
- [Authentication](#-authentication)
- [API Endpoints](#-api-endpoints)
- [Code Examples](#-code-examples)
- [Error Handling](#️-error-handling)
- [Tips & Best Practices](#-tips--best-practices)

---

## 🚀 Thông tin Backend

### Server Information
- **Base URL**: `http://localhost:5185/api`
- **Framework**: ASP.NET Core 8.0
- **Database**: SQL Server (ElearningDB)
- **CORS**: Enabled (AllowAnyOrigin)

### Swagger UI (API Documentation)
```
http://localhost:5185/swagger
```
👉 **Khuyến nghị**: Mở Swagger để xem chi tiết tất cả endpoints, parameters, và response models.

---

## 🔧 Cách chạy & Test

### 1. Chạy Backend
```bash
cd ElearningBackend
dotnet run
```

Chờ đến khi thấy:
```
Now listening on: http://localhost:5185
Application started. Press Ctrl+C to shut down.
```

### 2. Kiểm tra Backend đang chạy
Mở browser và truy cập:
```
http://localhost:5185/swagger
```

Hoặc test bằng JavaScript Console (F12):
```javascript
fetch('http://localhost:5185/api/Auth/Login', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username: 'sManager', password: 'sManager'})
})
.then(r => r.json())
.then(d => console.log(d))
```

---

## 🔐 Authentication

### Login API

**Endpoint**: `POST /api/Auth/Login`

**Request Body**:
```json
{
  "username": "sManager",
  "password": "sManager"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "base64_encoded_session_token",
  "username": "sManager",
  "role": "Admin"
}
```

**Response (Failed)**:
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Code Example**:
```javascript
async function login(username, password) {
    try {
        const response = await fetch('http://localhost:5185/api/Auth/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Lưu token
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            
            console.log('✅ Login success:', data);
            return data;
        } else {
            console.error('❌ Login failed:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Connection error:', error);
        alert('Backend không chạy! Vui lòng kiểm tra server.');
        return null;
    }
}

// Sử dụng:
const result = await login('sManager', 'sManager');
if (result) {
    window.location.href = 'pages/course-list.html';
}
```

### Logout API

**Endpoint**: `POST /api/Auth/Logout`

**Request Body**:
```json
{
  "token": "your_session_token"
}
```

**Code Example**:
```javascript
async function logout() {
    const token = localStorage.getItem('authToken');
    
    try {
        await fetch('http://localhost:5185/api/Auth/Logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    localStorage.clear();
    window.location.href = 'index.html';
}
```

### Validate Token

**Endpoint**: `GET /api/Auth/Validate?token={token}`

**Code Example**:
```javascript
async function checkAuth() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return false;
    }
    
    try {
        const response = await fetch(`http://localhost:5185/api/Auth/Validate?token=${token}`);
        const data = await response.json();
        
        if (!data.success) {
            localStorage.clear();
            window.location.href = 'index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}
```

---

## 📚 API Endpoints

### 👥 Users (UserTable)

#### GET All Users (với sorting)
```
GET /api/UserTable?sortBy={name|email|date|account}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getUsers(sortBy = 'name', sortOrder = 'asc') {
    const url = `http://localhost:5185/api/UserTable?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    const response = await fetch(url);
    const users = await response.json();
    return users;
}
```

#### GET User by ID
```
GET /api/UserTable/{id}
```

#### POST Create User
```
POST /api/UserTable
Body: UserTable object
```

#### PUT Update User
```
PUT /api/UserTable/{id}
Body: UserTable object
```

#### DELETE User
```
DELETE /api/UserTable/{id}
```

---

### 📚 Courses

#### GET All Courses (với sorting & filtering)
```
GET /api/Course?sortBy={name|students|rating|duration}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getCourses(sortBy = 'name', sortOrder = 'asc') {
    const url = `http://localhost:5185/api/Course?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    const response = await fetch(url);
    const courses = await response.json();
    
    // Display courses
    courses.forEach(course => {
        console.log(`${course.courseID} - ${course.courseName}`);
        console.log(`Students: ${course.numStudents}, Rating: ${course.averageRating}`);
    });
    
    return courses;
}
```

#### GET Course by ID (với chapters)
```
GET /api/Course/{id}
```

**Response** bao gồm: Course info + Teacher + Chapters

#### GET Courses by Teacher
```
GET /api/Course/teacher/{teacherId}
```

#### POST Create Course
```
POST /api/Course
Body: { courseName, teacherId, ... }
```

#### PUT Update Course
```
PUT /api/Course/{id}
```

#### DELETE Course
```
DELETE /api/Course/{id}
```

---

### 📖 Chapters

#### GET Chapters by Course
```
GET /api/Chapter/course/{courseId}
```

**Code Example**:
```javascript
async function getCourseChapters(courseId) {
    const url = `http://localhost:5185/api/Chapter/course/${courseId}`;
    const response = await fetch(url);
    const chapters = await response.json();
    
    // Chapters bao gồm: VideoLessons, TheoryLessons, Exercises, Tests
    chapters.forEach(chapter => {
        console.log(`Chapter: ${chapter.title}`);
        console.log(`Videos: ${chapter.videoLessons?.length || 0}`);
        console.log(`Theories: ${chapter.theoryLessons?.length || 0}`);
        console.log(`Exercises: ${chapter.exercises?.length || 0}`);
        console.log(`Tests: ${chapter.tests?.length || 0}`);
    });
    
    return chapters;
}
```

#### GET Chapter by ID
```
GET /api/Chapter/{id}
```

---

### 🎥 Video Lessons

#### GET Videos by Chapter (với sorting)
```
GET /api/VideoLesson/chapter/{chapterId}?sortBy={title|duration}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getChapterVideos(chapterId) {
    const url = `http://localhost:5185/api/VideoLesson/chapter/${chapterId}?sortBy=title&sortOrder=asc`;
    const response = await fetch(url);
    const videos = await response.json();
    
    videos.forEach(video => {
        console.log(`${video.title} - ${video.durationMinutes} mins`);
        console.log(`URL: ${video.videoURL}`);
    });
    
    return videos;
}
```

#### GET Video by ID
```
GET /api/VideoLesson/{id}
```

---

### 📝 Theory Lessons

#### GET Theories by Chapter (với sorting)
```
GET /api/TheoryLesson/chapter/{chapterId}?sortBy={title|duration}&sortOrder={asc|desc}
```

---

### 📋 Exercises

#### GET Exercises by Chapter (với sorting)
```
GET /api/Exercise/chapter/{chapterId}?sortBy={title}&sortOrder={asc|desc}
```

#### GET Exercise by ID
```
GET /api/Exercise/{id}
```

---

### 📝 Tests

#### GET Tests by Chapter (với sorting)
```
GET /api/Test/chapter/{chapterId}?sortBy={name|duration}&sortOrder={asc|desc}
```

#### GET Test by ID (với questions & answers)
```
GET /api/Test/{id}
```

**Response** bao gồm: Test info + Questions + Answers

---

### 💪 Practices

#### GET All Practices (với filtering & sorting)
```
GET /api/Practice?difficulty={Easy|Medium|Hard}&sortBy={title|difficulty}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getPractices(difficulty = null, sortBy = 'title') {
    let url = `http://localhost:5185/api/Practice?sortBy=${sortBy}&sortOrder=asc`;
    if (difficulty) {
        url += `&difficulty=${difficulty}`;
    }
    
    const response = await fetch(url);
    const practices = await response.json();
    return practices;
}

// Lấy tất cả bài Easy
const easyPractices = await getPractices('Easy');

// Lấy tất cả bài
const allPractices = await getPractices();
```

#### GET Practice Attempts
```
GET /api/Practice/{id}/attempts
```

---

### 📝 Posts

#### GET All Posts (với sorting)
```
GET /api/Post?sortBy={date|title}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getPosts(sortBy = 'date', sortOrder = 'desc') {
    const url = `http://localhost:5185/api/Post?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    const response = await fetch(url);
    const posts = await response.json();
    return posts;
}
```

#### GET Posts by User
```
GET /api/Post/user/{userId}
```

#### GET Post by ID
```
GET /api/Post/{id}
```

---

### 💬 Comments

#### GET Comments by Post (với sorting)
```
GET /api/Comment/post/{postId}?sortBy={date}&sortOrder={asc|desc}
```

#### GET Comments by Course (với sorting)
```
GET /api/Comment/course/{courseId}?sortBy={date}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getPostComments(postId) {
    const url = `http://localhost:5185/api/Comment/post/${postId}?sortBy=date&sortOrder=desc`;
    const response = await fetch(url);
    const comments = await response.json();
    
    comments.forEach(comment => {
        console.log(`${comment.user?.fullName}: ${comment.content}`);
        console.log(`Posted at: ${comment.createdAt}`);
    });
    
    return comments;
}
```

---

### ⭐ Ratings

#### GET Ratings by Course (với sorting)
```
GET /api/Rating/course/{courseId}?sortBy={rating}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getCourseRatings(courseId) {
    const url = `http://localhost:5185/api/Rating/course/${courseId}?sortBy=rating&sortOrder=desc`;
    const response = await fetch(url);
    const ratings = await response.json();
    
    // Tính average rating
    const total = ratings.reduce((sum, r) => sum + (r.ratingValue || 0), 0);
    const average = ratings.length > 0 ? (total / ratings.length).toFixed(1) : 0;
    
    console.log(`Average Rating: ${average}/5 (${ratings.length} reviews)`);
    
    return ratings;
}
```

---

### 🎓 Enrollments

#### GET Enrollments by User (với sorting)
```
GET /api/Enrollment/user/{userId}?sortBy={date}&sortOrder={asc|desc}
```

#### GET Enrollments by Course (với sorting)
```
GET /api/Enrollment/course/{courseId}?sortBy={date}&sortOrder={asc|desc}
```

**Code Example**:
```javascript
async function getUserEnrollments(userId) {
    const url = `http://localhost:5185/api/Enrollment/user/${userId}?sortBy=date&sortOrder=desc`;
    const response = await fetch(url);
    const enrollments = await response.json();
    
    enrollments.forEach(enrollment => {
        console.log(`Course: ${enrollment.course?.courseName}`);
        console.log(`Enrolled: ${enrollment.enrollmentDate}`);
    });
    
    return enrollments;
}
```

---

## 💻 Code Examples

### Helper Function: API Call với Error Handling

```javascript
// Hàm helper để gọi API
async function apiCall(endpoint, method = 'GET', body = null) {
    const baseUrl = 'http://localhost:5185/api';
    const url = baseUrl + endpoint;
    
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    
    // Thêm auth token nếu có
    const token = localStorage.getItem('authToken');
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Thêm body cho POST/PUT
    if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        
        // Kiểm tra status
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
    }
}

// Sử dụng:
try {
    const courses = await apiCall('/Course?sortBy=name&sortOrder=asc');
    console.log('Courses:', courses);
} catch (error) {
    alert('Lỗi khi lấy danh sách khóa học: ' + error.message);
}
```

### Example: Load Course List Page

```javascript
// course-list.js
async function loadCourses() {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('authToken')) {
        window.location.href = '../index.html';
        return;
    }
    
    try {
        // Lấy danh sách courses
        const courses = await apiCall('/Course?sortBy=students&sortOrder=desc');
        
        // Render lên UI
        const tbody = document.getElementById('courseTableBody');
        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const row = `
                <tr>
                    <td>${course.courseID}</td>
                    <td><a href="course-detail.html?id=${course.courseID}">${course.courseName}</a></td>
                    <td>${course.teacher?.user?.fullName || 'N/A'}</td>
                    <td>${course.numStudents}</td>
                    <td>${course.averageRating.toFixed(1)} ⭐</td>
                    <td>${course.courseState}</td>
                    <td>
                        <button onclick="editCourse('${course.courseID}')">Sửa</button>
                        <button onclick="deleteCourse('${course.courseID}')">Xóa</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
        
    } catch (error) {
        console.error('Load courses failed:', error);
        alert('Không thể tải danh sách khóa học!');
    }
}

// Load khi page ready
window.addEventListener('DOMContentLoaded', loadCourses);
```

### Example: Search & Filter

```javascript
// Tìm kiếm và lọc courses
async function searchCourses(searchText, sortBy, sortOrder) {
    try {
        // Lấy tất cả courses với sorting
        const allCourses = await apiCall(`/Course?sortBy=${sortBy}&sortOrder=${sortOrder}`);
        
        // Filter ở client (hoặc có thể thêm search parameter vào API)
        const filtered = allCourses.filter(course => {
            if (!searchText) return true;
            
            const text = searchText.toLowerCase();
            return (
                course.courseName.toLowerCase().includes(text) ||
                course.courseID.toLowerCase().includes(text) ||
                course.teacher?.user?.fullName?.toLowerCase().includes(text)
            );
        });
        
        return filtered;
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}

// Sử dụng
const results = await searchCourses('JavaScript', 'name', 'asc');
```

---

## ⚠️ Error Handling

### Common Errors

| Error | Nguyên nhân | Giải pháp |
|-------|-------------|-----------|
| `Failed to fetch` | Backend không chạy | Chạy `dotnet run` |
| `CORS error` | CORS chưa config | Backend đã config, refresh browser |
| `401 Unauthorized` | Chưa login hoặc token hết hạn | Login lại |
| `404 Not Found` | Endpoint sai hoặc resource không tồn tại | Kiểm tra URL và ID |
| `500 Server Error` | Lỗi backend | Xem Console log ở terminal backend |

### Error Handling Pattern

```javascript
async function safeApiCall(apiFunction) {
    try {
        return await apiFunction();
    } catch (error) {
        console.error('API Error:', error);
        
        if (error.message.includes('Failed to fetch')) {
            alert('⚠️ Backend không chạy! Vui lòng kiểm tra server.');
        } else if (error.message.includes('401')) {
            alert('⚠️ Session hết hạn. Vui lòng đăng nhập lại.');
            localStorage.clear();
            window.location.href = 'index.html';
        } else {
            alert('❌ Lỗi: ' + error.message);
        }
        
        return null;
    }
}

// Sử dụng
const courses = await safeApiCall(() => apiCall('/Course'));
if (courses) {
    // Process courses
}
```

---

## 💡 Tips & Best Practices

### 1. Luôn kiểm tra Backend đang chạy
```javascript
async function checkBackend() {
    try {
        await fetch('http://localhost:5185/api/Auth/Validate?token=test');
        return true;
    } catch {
        alert('⚠️ Backend không chạy! Chạy: dotnet run');
        return false;
    }
}
```

### 2. Cache data khi có thể
```javascript
let coursesCache = null;
let cacheTime = null;

async function getCourses(forceRefresh = false) {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    if (!forceRefresh && coursesCache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
        return coursesCache;
    }
    
    coursesCache = await apiCall('/Course');
    cacheTime = Date.now();
    return coursesCache;
}
```

### 3. Loading state
```javascript
async function loadWithSpinner(apiFunction) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = 'block';
    
    try {
        return await apiFunction();
    } finally {
        spinner.style.display = 'none';
    }
}

// Sử dụng
const courses = await loadWithSpinner(() => apiCall('/Course'));
```

### 4. Debounce cho search
```javascript
let searchTimeout;

function searchInput(value) {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(async () => {
        const results = await searchCourses(value, 'name', 'asc');
        displayResults(results);
    }, 300); // Đợi 300ms sau khi user ngừng gõ
}
```

---

## 🔗 Quick Links

- **Swagger UI**: http://localhost:5185/swagger
- **API Base URL**: http://localhost:5185/api
- **Backend Code**: `Controllers/` folder

---
