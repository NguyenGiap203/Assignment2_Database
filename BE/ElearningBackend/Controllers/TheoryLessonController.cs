using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TheoryLessonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TheoryLessonController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TheoryLesson
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var theories = await _context.TheoryLessons
                    .Include(t => t.Chapter)
                    .ToListAsync();

                return Ok(theories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving theory lessons", error = ex.Message });
            }
        }

        // GET: api/TheoryLesson/chapter/{chapterId}?sortBy=title|duration&sortOrder=asc|desc
        [HttpGet("chapter/{chapterId}")]
        public async Task<IActionResult> GetByChapter(string chapterId, [FromQuery] string? sortBy = "title", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.TheoryLessons
                    .Where(t => t.ChapterID == chapterId)
                    .Include(t => t.Chapter)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(t => t.Title),
                    ("title", _) => query.OrderBy(t => t.Title),
                    ("duration", "desc") => query.OrderByDescending(t => t.DurationMinutes),
                    ("duration", "asc") => query.OrderBy(t => t.DurationMinutes),
                    _ => query.OrderBy(t => t.Title)
                };

                var theories = await query.ToListAsync();

                return Ok(theories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving theory lessons", error = ex.Message });
            }
        }

        // GET: api/TheoryLesson/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var theory = await _context.TheoryLessons
                    .Include(t => t.Chapter)
                    .FirstOrDefaultAsync(t => t.TheoryLessonID == id);

                if (theory == null)
                    return NotFound(new { message = "Theory lesson not found" });

                return Ok(theory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving theory lesson", error = ex.Message });
            }
        }

        // POST: api/TheoryLesson
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTheoryLessonRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Validate chapter exists
                var chapter = await _context.Chapters.FindAsync(request.ChapterID);
                if (chapter == null)
                    return BadRequest(new { message = "Chapter not found" });

                // Generate new ID
                var maxId = await _context.TheoryLessons
                    .Select(t => t.TheoryLessonID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("THR"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"THR{nextNumber:D7}";

                var theory = new TheoryLesson
                {
                    TheoryLessonID = newId,
                    ChapterID = request.ChapterID,
                    Title = request.Title,
                    Content = request.Content,
                    DurationMinutes = request.DurationMinutes
                };

                _context.TheoryLessons.Add(theory);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, theory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating theory lesson", error = ex.Message });
            }
        }

        // PUT: api/TheoryLesson/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTheoryLessonRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var theory = await _context.TheoryLessons.FindAsync(id);
                if (theory == null)
                    return NotFound(new { message = "Theory lesson not found" });

                // Validate chapter if changed
                if (request.ChapterID != null && request.ChapterID != theory.ChapterID)
                {
                    var chapter = await _context.Chapters.FindAsync(request.ChapterID);
                    if (chapter == null)
                        return BadRequest(new { message = "Chapter not found" });

                    theory.ChapterID = request.ChapterID;
                }

                if (request.Title != null)
                    theory.Title = request.Title;

                if (request.Content != null)
                    theory.Content = request.Content;

                if (request.DurationMinutes.HasValue)
                    theory.DurationMinutes = request.DurationMinutes.Value;

                await _context.SaveChangesAsync();

                return Ok(theory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating theory lesson", error = ex.Message });
            }
        }

        // DELETE: api/TheoryLesson/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var theory = await _context.TheoryLessons.FindAsync(id);
                if (theory == null)
                    return NotFound(new { message = "Theory lesson not found" });

                _context.TheoryLessons.Remove(theory);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Theory lesson deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting theory lesson", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateTheoryLessonRequest
    {
        public string ChapterID { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string? Content { get; set; }
        public int DurationMinutes { get; set; }
    }

    public class UpdateTheoryLessonRequest
    {
        public string? ChapterID { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? DurationMinutes { get; set; }
    }
}
