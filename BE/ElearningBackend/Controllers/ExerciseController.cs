using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExerciseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExerciseController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Exercise/chapter/{chapterId}?sortBy=title|difficulty&sortOrder=asc|desc
        [HttpGet("chapter/{chapterId}")]
        public async Task<IActionResult> GetByChapter(string chapterId, [FromQuery] string? sortBy = "title", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Exercises
                    .Where(e => e.ChapterID == chapterId)
                    .Include(e => e.Chapter)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(e => e.Title),
                    ("title", _) => query.OrderBy(e => e.Title),
                    _ => query.OrderBy(e => e.Title)
                };

                var exercises = await query.ToListAsync();

                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving exercises", error = ex.Message });
            }
        }

        // GET: api/Exercise/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var exercise = await _context.Exercises
                    .Include(e => e.Chapter)
                    .FirstOrDefaultAsync(e => e.ExerciseID == id);

                if (exercise == null)
                    return NotFound(new { message = "Exercise not found" });

                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving exercise", error = ex.Message });
            }
        }

        // POST: api/Exercise
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateExerciseRequest request)
        {
            try
            {
                var chapter = await _context.Chapters.FindAsync(request.ChapterID);
                if (chapter == null)
                    return BadRequest(new { message = "Chapter not found" });

                // Generate new ID
                var maxId = await _context.Exercises
                    .Select(e => e.ExerciseID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("EXE"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"EXE{nextNumber:D7}";

                var exercise = new Exercise
                {
                    ExerciseID = newId,
                    ChapterID = request.ChapterID,
                    Title = request.Title,
                    ExDescription = request.ExDescription,
                    SampleAnswer = request.SampleAnswer,
                    MinPassingScore = request.MinPassingScore
                };

                _context.Exercises.Add(exercise);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating exercise", error = ex.Message });
            }
        }

        // PUT: api/Exercise/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateExerciseRequest request)
        {
            try
            {
                var exercise = await _context.Exercises.FindAsync(id);
                if (exercise == null)
                    return NotFound(new { message = "Exercise not found" });

                exercise.Title = request.Title ?? exercise.Title;
                exercise.ExDescription = request.ExDescription ?? exercise.ExDescription;
                exercise.SampleAnswer = request.SampleAnswer ?? exercise.SampleAnswer;
                exercise.MinPassingScore = request.MinPassingScore ?? exercise.MinPassingScore;

                await _context.SaveChangesAsync();

                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating exercise", error = ex.Message });
            }
        }

        // DELETE: api/Exercise/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var exercise = await _context.Exercises.FindAsync(id);
                if (exercise == null)
                    return NotFound(new { message = "Exercise not found" });

                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Exercise deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting exercise", error = ex.Message });
            }
        }

        // POST: api/Exercise/{id}/submit
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitAttempt(string id, [FromBody] SubmitExerciseRequest request)
        {
            try
            {
                var exercise = await _context.Exercises.FindAsync(id);
                if (exercise == null)
                    return NotFound(new { message = "Exercise not found" });

                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                var attempt = new ExerciseAttempt
                {
                    UserID = request.UserID,
                    ExerciseID = id,
                    StartTime = request.StartTime ?? DateTime.Now,
                    SubmitTime = DateTime.Now,
                    Score = request.Score
                };

                _context.ExerciseAttempts.Add(attempt);
                await _context.SaveChangesAsync();

                return Ok(attempt);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting exercise", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateExerciseRequest
    {
        public string ChapterID { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string ExDescription { get; set; } = null!;
        public string SampleAnswer { get; set; } = null!;
        public int MinPassingScore { get; set; }
    }

    public class UpdateExerciseRequest
    {
        public string? Title { get; set; }
        public string? ExDescription { get; set; }
        public string? SampleAnswer { get; set; }
        public int? MinPassingScore { get; set; }
    }

    public class SubmitExerciseRequest
    {
        public string UserID { get; set; } = null!;
        public DateTime? StartTime { get; set; }
        public decimal? Score { get; set; }
    }
}
