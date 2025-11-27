using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Enrollment/user/{userId}?sortBy=date|course&sortOrder=asc|desc
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUser(string userId, [FromQuery] string? sortBy = "date", [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.CourseEnrollments
                    .Where(e => e.UserID == userId)
                    .Include(e => e.Course)
                        .ThenInclude(c => c!.Teacher)
                            .ThenInclude(t => t!.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("date", "asc") => query.OrderBy(e => e.EnrollmentDate),
                    ("date", _) => query.OrderByDescending(e => e.EnrollmentDate),
                    _ => query.OrderByDescending(e => e.EnrollmentDate)
                };

                var enrollments = await query.ToListAsync();

                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving enrollments", error = ex.Message });
            }
        }

        // GET: api/Enrollment/course/{courseId}?sortBy=date&sortOrder=asc|desc
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(string courseId, [FromQuery] string? sortBy = "date", [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.CourseEnrollments
                    .Where(e => e.CourseID == courseId)
                    .Include(e => e.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("date", "asc") => query.OrderBy(e => e.EnrollmentDate),
                    ("date", _) => query.OrderByDescending(e => e.EnrollmentDate),
                    _ => query.OrderByDescending(e => e.EnrollmentDate)
                };

                var enrollments = await query.ToListAsync();

                return Ok(enrollments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving enrollments", error = ex.Message });
            }
        }

        // POST: api/Enrollment
        [HttpPost]
        public async Task<IActionResult> Enroll([FromBody] EnrollCourseRequest request)
        {
            try
            {
                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                var course = await _context.Courses.FindAsync(request.CourseID);
                if (course == null)
                    return BadRequest(new { message = "Course not found" });

                // Check if already enrolled
                var existing = await _context.CourseEnrollments
                    .FirstOrDefaultAsync(e => e.UserID == request.UserID && e.CourseID == request.CourseID);

                if (existing != null)
                    return BadRequest(new { message = "Already enrolled in this course" });

                var enrollment = new CourseEnrollment
                {
                    UserID = request.UserID,
                    CourseID = request.CourseID,
                    EnrollmentDate = DateTime.Now
                };

                _context.CourseEnrollments.Add(enrollment);

                // Update course student count
                course.NumStudents++;

                await _context.SaveChangesAsync();

                return Ok(enrollment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error enrolling in course", error = ex.Message });
            }
        }

        // DELETE: api/Enrollment
        [HttpDelete]
        public async Task<IActionResult> Unenroll([FromBody] EnrollCourseRequest request)
        {
            try
            {
                var enrollment = await _context.CourseEnrollments
                    .FirstOrDefaultAsync(e => e.UserID == request.UserID && e.CourseID == request.CourseID);

                if (enrollment == null)
                    return NotFound(new { message = "Enrollment not found" });

                _context.CourseEnrollments.Remove(enrollment);

                // Update course student count
                var course = await _context.Courses.FindAsync(request.CourseID);
                if (course != null && course.NumStudents > 0)
                {
                    course.NumStudents--;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Unenrolled successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error unenrolling from course", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class EnrollCourseRequest
    {
        public string UserID { get; set; } = null!;
        public string CourseID { get; set; } = null!;
    }
}
