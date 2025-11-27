using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Test/chapter/{chapterId}?sortBy=title&sortOrder=asc|desc
        [HttpGet("chapter/{chapterId}")]
        public async Task<IActionResult> GetByChapter(string chapterId, [FromQuery] string? sortBy = "title", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.Tests
                    .Where(t => t.ChapterID == chapterId)
                    .Include(t => t.Chapter)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("name", "desc") => query.OrderByDescending(t => t.TestName),
                    ("name", _) => query.OrderBy(t => t.TestName),
                    ("duration", "desc") => query.OrderByDescending(t => t.TestDuration),
                    ("duration", "asc") => query.OrderBy(t => t.TestDuration),
                    _ => query.OrderBy(t => t.TestName)
                };

                var tests = await query.ToListAsync();

                return Ok(tests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving tests", error = ex.Message });
            }
        }

        // GET: api/Test/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var test = await _context.Tests
                    .Include(t => t.Chapter)
                    .Include(t => t.Questions)
                        .ThenInclude(q => q.Answers)
                    .FirstOrDefaultAsync(t => t.TestID == id);

                if (test == null)
                    return NotFound(new { message = "Test not found" });

                return Ok(test);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving test", error = ex.Message });
            }
        }

        // POST: api/Test
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTestRequest request)
        {
            try
            {
                var chapter = await _context.Chapters.FindAsync(request.ChapterID);
                if (chapter == null)
                    return BadRequest(new { message = "Chapter not found" });

                // Generate new ID
                var maxId = await _context.Tests
                    .Select(t => t.TestID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("TST"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"TST{nextNumber:D7}";

                var test = new Test
                {
                    TestID = newId,
                    TestName = request.TestName,
                    TestDuration = request.TestDuration,
                    ScoreToPass = request.ScoreToPass,
                    TotalScore = request.TotalScore,
                    ChapterID = request.ChapterID
                };

                _context.Tests.Add(test);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, test);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating test", error = ex.Message });
            }
        }

        // PUT: api/Test/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateTestRequest request)
        {
            try
            {
                var test = await _context.Tests.FindAsync(id);
                if (test == null)
                    return NotFound(new { message = "Test not found" });

                test.TestName = request.TestName ?? test.TestName;
                test.TestDuration = request.TestDuration ?? test.TestDuration;
                test.ScoreToPass = request.ScoreToPass ?? test.ScoreToPass;
                test.TotalScore = request.TotalScore ?? test.TotalScore;

                await _context.SaveChangesAsync();

                return Ok(test);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating test", error = ex.Message });
            }
        }

        // DELETE: api/Test/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var test = await _context.Tests.FindAsync(id);
                if (test == null)
                    return NotFound(new { message = "Test not found" });

                _context.Tests.Remove(test);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Test deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting test", error = ex.Message });
            }
        }

        // POST: api/Test/{testId}/question
        [HttpPost("{testId}/question")]
        public async Task<IActionResult> AddQuestion(string testId, [FromBody] CreateQuestionRequest request)
        {
            try
            {
                var test = await _context.Tests.FindAsync(testId);
                if (test == null)
                    return NotFound(new { message = "Test not found" });

                var question = new Question
                {
                    TestID = testId,
                    QuestionNo = request.QuestionNo,
                    QuestionContent = request.QuestionContent,
                    Score = request.Score
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                return Ok(question);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding question", error = ex.Message });
            }
        }

        // POST: api/Test/{testId}/question/{questionNo}/answer
        [HttpPost("{testId}/question/{questionNo}/answer")]
        public async Task<IActionResult> AddAnswer(string testId, int questionNo, [FromBody] CreateAnswerRequest request)
        {
            try
            {
                var question = await _context.Questions
                    .FirstOrDefaultAsync(q => q.TestID == testId && q.QuestionNo == questionNo);

                if (question == null)
                    return NotFound(new { message = "Question not found" });

                var answer = new Answer
                {
                    TestID = testId,
                    QuestionNo = questionNo,
                    AnswerNo = request.AnswerNo,
                    AnswerContent = request.AnswerContent,
                    IsCorrect = request.IsCorrect
                };

                _context.Answers.Add(answer);
                await _context.SaveChangesAsync();

                return Ok(answer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding answer", error = ex.Message });
            }
        }

        // POST: api/Test/{id}/submit
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitAttempt(string id, [FromBody] SubmitTestRequest request)
        {
            try
            {
                var test = await _context.Tests.FindAsync(id);
                if (test == null)
                    return NotFound(new { message = "Test not found" });

                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                var attempt = new TestAttemptRecord
                {
                    UserID = request.UserID,
                    TestID = id,
                    StartTime = request.StartTime ?? DateTime.Now,
                    SubmitTime = DateTime.Now,
                    Score = request.Score
                };

                _context.TestAttemptRecords.Add(attempt);
                await _context.SaveChangesAsync();

                return Ok(attempt);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting test", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateTestRequest
    {
        public string TestName { get; set; } = null!;
        public int TestDuration { get; set; }
        public int ScoreToPass { get; set; }
        public int TotalScore { get; set; }
        public string ChapterID { get; set; } = null!;
    }

    public class UpdateTestRequest
    {
        public string? TestName { get; set; }
        public int? TestDuration { get; set; }
        public int? ScoreToPass { get; set; }
        public int? TotalScore { get; set; }
    }

    public class CreateQuestionRequest
    {
        public int QuestionNo { get; set; }
        public string QuestionContent { get; set; } = null!;
        public int Score { get; set; }
    }

    public class CreateAnswerRequest
    {
        public int AnswerNo { get; set; }
        public string AnswerContent { get; set; } = null!;
        public bool IsCorrect { get; set; }
    }

    public class SubmitTestRequest
    {
        public string UserID { get; set; } = null!;
        public DateTime? StartTime { get; set; }
        public decimal? Score { get; set; }
    }
}
