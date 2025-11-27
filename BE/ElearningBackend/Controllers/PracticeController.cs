using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PracticeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PracticeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Practice?difficulty=Easy|Medium|Hard&sortBy=title|difficulty&sortOrder=asc|desc
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? difficulty = null, [FromQuery] string? sortBy = "title", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Practices
                    .Include(p => p.Teacher)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(difficulty))
                {
                    query = query.Where(p => p.Difficulty == difficulty);
                }

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(p => p.Title),
                    ("title", _) => query.OrderBy(p => p.Title),
                    ("difficulty", "desc") => query.OrderByDescending(p => p.Difficulty),
                    ("difficulty", "asc") => query.OrderBy(p => p.Difficulty),
                    _ => query.OrderBy(p => p.Title)
                };

                var practices = await query.ToListAsync();

                return Ok(practices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving practices", error = ex.Message });
            }
        }

        // GET: api/Practice/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var practice = await _context.Practices
                    .Include(p => p.Teacher)
                    .Include(p => p.PracticeAttemptInfos)
                    .FirstOrDefaultAsync(p => p.PracticeID == id);

                if (practice == null)
                    return NotFound(new { message = "Practice not found" });

                return Ok(practice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving practice", error = ex.Message });
            }
        }

        // GET: api/Practice/{id}/attempts - Get all attempts for a practice
        [HttpGet("{id}/attempts")]
        public async Task<IActionResult> GetAttempts(string id)
        {
            try
            {
                var practice = await _context.Practices.FindAsync(id);
                if (practice == null)
                    return NotFound(new { message = "Practice not found" });

                var attempts = await _context.PracticeAttemptInfos
                    .Where(a => a.PracticeID == id)
                    .Include(a => a.User)
                    .OrderByDescending(a => a.SubmitTime)
                    .ToListAsync();

                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving practice attempts", error = ex.Message });
            }
        }

        // GET: api/Practice/teacher/{teacherId}
        [HttpGet("teacher/{teacherId}")]
        public async Task<IActionResult> GetByTeacher(string teacherId)
        {
            try
            {
                var practices = await _context.Practices
                    .Where(p => p.TeacherID == teacherId)
                    .Include(p => p.Teacher)
                    .ToListAsync();

                return Ok(practices);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving practices", error = ex.Message });
            }
        }

        // POST: api/Practice
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePracticeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate teacher exists
                var teacher = await _context.Teachers.FindAsync(request.TeacherID);
                if (teacher == null)
                    return BadRequest(new { message = "Teacher not found" });

                // Validate difficulty
                var validDifficulties = new[] { "Easy", "Medium", "Hard" };
                if (!validDifficulties.Contains(request.Difficulty))
                    return BadRequest(new { message = "Difficulty must be Easy, Medium, or Hard" });

                // Generate new ID
                var maxId = await _context.Practices
                    .Select(p => p.PracticeID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("PRC"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"PRC{nextNumber:D7}";

                var practice = new Practice
                {
                    PracticeID = newId,
                    Title = request.Title,
                    Difficulty = request.Difficulty,
                    Content = request.Content,
                    TeacherID = request.TeacherID
                };

                _context.Practices.Add(practice);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, practice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating practice", error = ex.Message });
            }
        }

        // PUT: api/Practice/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdatePracticeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var practice = await _context.Practices.FindAsync(id);
                if (practice == null)
                    return NotFound(new { message = "Practice not found" });

                if (request.Title != null)
                    practice.Title = request.Title;

                if (request.Difficulty != null)
                {
                    var validDifficulties = new[] { "Easy", "Medium", "Hard" };
                    if (!validDifficulties.Contains(request.Difficulty))
                        return BadRequest(new { message = "Difficulty must be Easy, Medium, or Hard" });

                    practice.Difficulty = request.Difficulty;
                }

                if (request.Content != null)
                    practice.Content = request.Content;

                if (request.TeacherID != null && request.TeacherID != practice.TeacherID)
                {
                    var teacher = await _context.Teachers.FindAsync(request.TeacherID);
                    if (teacher == null)
                        return BadRequest(new { message = "Teacher not found" });

                    practice.TeacherID = request.TeacherID;
                }

                await _context.SaveChangesAsync();

                return Ok(practice);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating practice", error = ex.Message });
            }
        }

        // DELETE: api/Practice/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var practice = await _context.Practices.FindAsync(id);
                if (practice == null)
                    return NotFound(new { message = "Practice not found" });

                _context.Practices.Remove(practice);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Practice deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting practice", error = ex.Message });
            }
        }

        // POST: api/Practice/{id}/submit - Submit a practice attempt
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitAttempt(string id, [FromBody] SubmitPracticeAttemptRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate practice exists
                var practice = await _context.Practices.FindAsync(id);
                if (practice == null)
                    return NotFound(new { message = "Practice not found" });

                // Validate user exists
                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                var attempt = new PracticeAttemptInfo
                {
                    PracticeID = id,
                    UserID = request.UserID,
                    Score = (int?)request.Score,
                    SubmitTime = request.SubmitTime ?? DateTime.Now
                };

                _context.PracticeAttemptInfos.Add(attempt);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Practice attempt submitted successfully", attempt });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting practice attempt", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreatePracticeRequest
    {
        public string Title { get; set; } = null!;
        public string Difficulty { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string TeacherID { get; set; } = null!;
    }

    public class UpdatePracticeRequest
    {
        public string? Title { get; set; }
        public string? Difficulty { get; set; }
        public string? Content { get; set; }
        public string? TeacherID { get; set; }
    }

    public class SubmitPracticeAttemptRequest
    {
        public string UserID { get; set; } = null!;
        public decimal Score { get; set; }
        public DateTime? SubmitTime { get; set; }
    }
}
