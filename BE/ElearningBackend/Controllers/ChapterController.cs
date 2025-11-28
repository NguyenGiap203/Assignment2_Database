using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChapterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ChapterController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Chapter/course/{courseId}
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(string courseId)
        {
            try
            {
                var chapters = await _context.Chapters
                    .Where(ch => ch.CourseID == courseId)
                    .Include(ch => ch.VideoLessons)
                    .Include(ch => ch.TheoryLessons)
                    .Include(ch => ch.Exercises)
                    .Include(ch => ch.Tests)
                    .OrderBy(ch => ch.ChapterOrder)
                    .ToListAsync();

                return Ok(chapters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving chapters", error = ex.Message });
            }
        }

        // GET: api/Chapter/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var chapter = await _context.Chapters
                    .Include(ch => ch.Course)
                    .Include(ch => ch.VideoLessons)
                    .Include(ch => ch.TheoryLessons)
                    .Include(ch => ch.Exercises)
                    .Include(ch => ch.Tests)
                    .FirstOrDefaultAsync(ch => ch.ChapterID == id);

                if (chapter == null)
                    return NotFound(new { message = "Chapter not found" });

                return Ok(chapter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving chapter", error = ex.Message });
            }
        }

        // POST: api/Chapter
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateChapterRequest request)
        {
            try
            {
                // Validate course exists
                var course = await _context.Courses.FindAsync(request.CourseID);
                if (course == null)
                    return BadRequest(new { message = "Course not found" });

                // Generate new ID: CHAP + 6 digits (total 10 chars)
                var maxId = await _context.Chapters
                    .Where(ch => ch.ChapterID.StartsWith("CHAP"))
                    .Select(ch => ch.ChapterID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Select(id => int.TryParse(id.Substring(4), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"CHAP{nextNumber:D6}";

                var chapter = new Chapter
                {
                    ChapterID = newId,
                    CourseID = request.CourseID,
                    ChapterTitle = request.ChapterTitle,
                    ChapterOrder = request.ChapterOrder,
                    ChapterDescription = request.ChapterDescription
                };

                _context.Chapters.Add(chapter);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, chapter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating chapter", error = ex.Message });
            }
        }

        // PUT: api/Chapter/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateChapterRequest request)
        {
            try
            {
                var chapter = await _context.Chapters.FindAsync(id);
                if (chapter == null)
                    return NotFound(new { message = "Chapter not found" });

                chapter.ChapterTitle = request.ChapterTitle ?? chapter.ChapterTitle;
                chapter.ChapterOrder = request.ChapterOrder ?? chapter.ChapterOrder;
                chapter.ChapterDescription = request.ChapterDescription ?? chapter.ChapterDescription;

                await _context.SaveChangesAsync();

                return Ok(chapter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating chapter", error = ex.Message });
            }
        }

        // DELETE: api/Chapter/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var chapter = await _context.Chapters.FindAsync(id);
                if (chapter == null)
                    return NotFound(new { message = "Chapter not found" });

                // Xóa cascade: Xóa tất cả content của chapter trước
                // 1. Xóa VideoLessons
                var videos = await _context.VideoLessons.Where(v => v.ChapterID == id).ToListAsync();
                _context.VideoLessons.RemoveRange(videos);

                // 2. Xóa TheoryLessons
                var theories = await _context.TheoryLessons.Where(t => t.ChapterID == id).ToListAsync();
                _context.TheoryLessons.RemoveRange(theories);

                // 3. Xóa Exercises
                var exercises = await _context.Exercises.Where(e => e.ChapterID == id).ToListAsync();
                _context.Exercises.RemoveRange(exercises);

                // 4. Xóa Tests (và Questions, Answers)
                var tests = await _context.Tests.Where(t => t.ChapterID == id).ToListAsync();
                foreach (var test in tests)
                {
                    // Xóa Answers trước
                    var answers = await _context.Answers.Where(a => a.TestID == test.TestID).ToListAsync();
                    _context.Answers.RemoveRange(answers);

                    // Xóa Questions
                    var questions = await _context.Questions.Where(q => q.TestID == test.TestID).ToListAsync();
                    _context.Questions.RemoveRange(questions);
                }
                _context.Tests.RemoveRange(tests);

                // 5. Cuối cùng xóa Chapter
                _context.Chapters.Remove(chapter);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chapter and all related content deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting chapter", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateChapterRequest
    {
        public string CourseID { get; set; } = null!;
        public string ChapterTitle { get; set; } = null!;
        public int ChapterOrder { get; set; }
        public string? ChapterDescription { get; set; }
    }

    public class UpdateChapterRequest
    {
        public string? ChapterTitle { get; set; }
        public int? ChapterOrder { get; set; }
        public string? ChapterDescription { get; set; }
    }
}
