using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using System.Data;
using Microsoft.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class StatisticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StatisticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Statistics/StudentAvgScore/{userId}
    // Gọi Function: fn_CalculateStudentAvgScore
    [HttpGet("StudentAvgScore/{userId}")]
    public async Task<IActionResult> GetStudentAvgScore(string userId)
    {
        try
        {
            var userIdParam = new SqlParameter("@UserID", userId);

            var result = await _context.Database
                .SqlQueryRaw<decimal>("SELECT dbo.fn_CalculateStudentAvgScore(@UserID) AS Value", userIdParam)
                .ToListAsync();

            if (!result.Any())
                return NotFound(new { message = "No data found" });

            return Ok(new { userId, averageScore = result.First() });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error calculating average score", error = ex.Message });
        }
    }

    // GET: api/Statistics/CoursesByTeacher/{teacherId}
    // Gọi Function: fn_GetCoursesByTeacher
    [HttpGet("CoursesByTeacher/{teacherId}")]
    public async Task<IActionResult> GetCoursesByTeacher(string teacherId)
    {
        try
        {
            var teacherIdParam = new SqlParameter("@TeacherID", teacherId);

            var courses = await _context.Database
                .SqlQueryRaw<CourseInfoDto>(
                    "SELECT * FROM dbo.fn_GetCoursesByTeacher(@TeacherID)",
                    teacherIdParam)
                .ToListAsync();

            return Ok(courses);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting courses by teacher", error = ex.Message });
        }
    }

    // GET: api/Statistics/TopStudents?minScore=7.5
    // Gọi Stored Procedure: sp_GetTopStudents
    [HttpGet("TopStudents")]
    public async Task<IActionResult> GetTopStudents([FromQuery] decimal minScore = 5.0m)
    {
        try
        {
            var minScoreParam = new SqlParameter("@MinScore", minScore);

            var students = await _context.Database
                .SqlQueryRaw<TopStudentDto>(
                    "EXEC sp_GetTopStudents @MinScore",
                    minScoreParam)
                .ToListAsync();

            return Ok(students);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error getting top students", error = ex.Message });
        }
    }

    // POST: api/Statistics/EnrollCourse
    // Gọi Stored Procedure: sp_EnrollCourse
    [HttpPost("EnrollCourse")]
    public async Task<IActionResult> EnrollCourse([FromBody] EnrollCourseDto request)
    {
        try
        {
            var userIdParam = new SqlParameter("@UserID", request.UserID);
            var courseIdParam = new SqlParameter("@CourseID", request.CourseID);

            await _context.Database
                .ExecuteSqlRawAsync("EXEC sp_EnrollCourse @UserID, @CourseID", userIdParam, courseIdParam);

            return Ok(new { message = "Enrollment successful", userId = request.UserID, courseId = request.CourseID });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Enrollment failed", error = ex.Message });
        }
    }
}

// DTOs for query results
public class CourseInfoDto
{
    public string CourseID { get; set; } = null!;
    public string CourseName { get; set; } = null!;
    public decimal AverageRating { get; set; }
    public int NumStudents { get; set; }
}

public class TopStudentDto
{
    public string UserID { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public int TotalTestsTaken { get; set; }
    public decimal AverageScore { get; set; }
}

public class EnrollCourseDto
{
    public string UserID { get; set; } = null!;
    public string CourseID { get; set; } = null!;
}
