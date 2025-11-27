using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CourseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Course?sortBy=name|students|rating&sortOrder=asc|desc
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? sortBy = "name", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Courses
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("name", "desc") => query.OrderByDescending(c => c.CourseName),
                    ("name", _) => query.OrderBy(c => c.CourseName),
                    ("students", "desc") => query.OrderByDescending(c => c.NumStudents),
                    ("students", "asc") => query.OrderBy(c => c.NumStudents),
                    ("rating", "desc") => query.OrderByDescending(c => c.AverageRating),
                    ("rating", "asc") => query.OrderBy(c => c.AverageRating),
                    ("duration", "desc") => query.OrderByDescending(c => c.TotalDuration),
                    ("duration", "asc") => query.OrderBy(c => c.TotalDuration),
                    _ => query.OrderBy(c => c.CourseName)
                };

                var courses = await query.ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving courses", error = ex.Message });
            }
        }

        // GET: api/Course/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var course = await _context.Courses
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .Include(c => c.Chapters)
                    .FirstOrDefaultAsync(c => c.CourseID == id);

                if (course == null)
                    return NotFound(new { message = "Course not found" });

                return Ok(course);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving course", error = ex.Message });
            }
        }

        // GET: api/Course/teacher/{teacherId}
        [HttpGet("teacher/{teacherId}")]
        public async Task<IActionResult> GetByTeacher(string teacherId)
        {
            try
            {
                var courses = await _context.Courses
                    .Where(c => c.TeacherID == teacherId)
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving courses", error = ex.Message });
            }
        }

        // POST: api/Course
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCourseRequest request)
        {
            try
            {
                // Validate teacher exists
                var teacher = await _context.Teachers.FindAsync(request.TeacherID);
                if (teacher == null)
                    return BadRequest(new { message = "Teacher not found" });

                // Generate new ID
                var maxId = await _context.Courses
                    .Select(c => c.CourseID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("CRS"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"CRS{nextNumber:D7}";

                var course = new Course
                {
                    CourseID = newId,
                    CourseName = request.CourseName,
                    CourseState = request.CourseState ?? "Sắp ra mắt",
                    TeacherID = request.TeacherID
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                var createdCourse = await _context.Courses
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .FirstOrDefaultAsync(c => c.CourseID == newId);

                return CreatedAtAction(nameof(GetById), new { id = newId }, createdCourse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating course", error = ex.Message });
            }
        }

        // PUT: api/Course/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateCourseRequest request)
        {
            try
            {
                var course = await _context.Courses.FindAsync(id);
                if (course == null)
                    return NotFound(new { message = "Course not found" });

                // Update fields
                course.CourseName = request.CourseName ?? course.CourseName;
                course.CourseState = request.CourseState ?? course.CourseState;

                if (request.TeacherID != null)
                {
                    var teacher = await _context.Teachers.FindAsync(request.TeacherID);
                    if (teacher == null)
                        return BadRequest(new { message = "Teacher not found" });
                    course.TeacherID = request.TeacherID;
                }

                await _context.SaveChangesAsync();

                var updatedCourse = await _context.Courses
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .FirstOrDefaultAsync(c => c.CourseID == id);

                return Ok(updatedCourse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating course", error = ex.Message });
            }
        }

        // DELETE: api/Course/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var course = await _context.Courses.FindAsync(id);
                if (course == null)
                    return NotFound(new { message = "Course not found" });

                _context.Courses.Remove(course);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Course deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting course", error = ex.Message });
            }
        }

        // GET: api/Course/search?keyword=xxx
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            try
            {
                var courses = await _context.Courses
                    .Include(c => c.Teacher)
                        .ThenInclude(t => t!.User)
                    .Where(c => c.CourseName.Contains(keyword))
                    .ToListAsync();

                return Ok(courses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error searching courses", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateCourseRequest
    {
        public string CourseName { get; set; } = null!;
        public string? CourseState { get; set; }
        public string TeacherID { get; set; } = null!;
    }

    public class UpdateCourseRequest
    {
        public string? CourseName { get; set; }
        public string? CourseState { get; set; }
        public string? TeacherID { get; set; }
    }
}
