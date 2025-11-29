using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeacherController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeacherController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Teacher
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var teachers = await _context.Teachers
                    .Include(t => t.User)
                    .Include(t => t.Educations)
                    .Include(t => t.Courses)
                    .ToListAsync();

                return Ok(teachers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving teachers", error = ex.Message });
            }
        }

        // GET: api/Teacher/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var teacher = await _context.Teachers
                    .Include(t => t.User)
                    .Include(t => t.Educations)
                    .Include(t => t.Courses)
                    .Include(t => t.Practices)
                    .FirstOrDefaultAsync(t => t.TeacherID == id);

                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                return Ok(teacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving teacher", error = ex.Message });
            }
        }

        // POST: api/Teacher
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeacherRequest request)
        {
            try
            {
                // Validate user exists
                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                // Check if teacher already exists for this user
                var existingTeacher = await _context.Teachers.FindAsync(request.UserID);
                if (existingTeacher != null)
                    return BadRequest(new { message = "This user is already a teacher" });

                var teacher = new Teacher
                {
                    TeacherID = request.UserID
                };

                _context.Teachers.Add(teacher);
                await _context.SaveChangesAsync();

                var createdTeacher = await _context.Teachers
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.TeacherID == request.UserID);

                return CreatedAtAction(nameof(GetById), new { id = request.UserID }, createdTeacher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating teacher", error = ex.Message });
            }
        }

        // DELETE: api/Teacher/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(id);
                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                _context.Teachers.Remove(teacher);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Teacher deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting teacher", error = ex.Message });
            }
        }

        // POST: api/Teacher/{id}/education
        [HttpPost("{id}/education")]
        public async Task<IActionResult> AddEducation(string id, [FromBody] CreateTeacherEducationRequest request)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(id);
                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                var education = new TeacherEducation
                {
                    TeacherID = id,
                    Degree = request.Degree,
                    Major = request.Major,
                    School = request.School,
                    StartTime = request.StartTime,
                    EndTime = request.EndTime
                };

                _context.TeacherEducations.Add(education);
                await _context.SaveChangesAsync();

                return Ok(education);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding education", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateTeacherRequest
    {
        public string UserID { get; set; } = null!;
    }

    public class CreateTeacherEducationRequest
    {
        public string Degree { get; set; } = null!;
        public string Major { get; set; } = null!;
        public string School { get; set; } = null!;
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
