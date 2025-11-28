using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoLessonController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VideoLessonController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/VideoLesson
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var videos = await _context.VideoLessons
                    .Include(v => v.Chapter)
                    .ToListAsync();

                return Ok(videos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving video lessons", error = ex.Message });
            }
        }

        // GET: api/VideoLesson/chapter/{chapterId}?sortBy=title|duration&sortOrder=asc|desc
        [HttpGet("chapter/{chapterId}")]
        public async Task<IActionResult> GetByChapter(string chapterId, [FromQuery] string? sortBy = "title", [FromQuery] string? sortOrder = "asc")
        {
            try
            {
                var query = _context.VideoLessons
                    .Where(v => v.ChapterID == chapterId)
                    .Include(v => v.Chapter)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("title", "desc") => query.OrderByDescending(v => v.Title),
                    ("title", _) => query.OrderBy(v => v.Title),
                    ("duration", "desc") => query.OrderByDescending(v => v.DurationMinutes),
                    ("duration", "asc") => query.OrderBy(v => v.DurationMinutes),
                    _ => query.OrderBy(v => v.Title)
                };

                var videos = await query.ToListAsync();

                return Ok(videos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving video lessons", error = ex.Message });
            }
        }

        // GET: api/VideoLesson/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var video = await _context.VideoLessons
                    .Include(v => v.Chapter)
                    .FirstOrDefaultAsync(v => v.VideoID == id);

                if (video == null)
                    return NotFound(new { message = "Video lesson not found" });

                return Ok(video);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving video lesson", error = ex.Message });
            }
        }

        // POST: api/VideoLesson
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateVideoLessonRequest request)
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
                var maxId = await _context.VideoLessons
                    .Select(v => v.VideoID)
                    .ToListAsync();

                int nextNumber = 1;
                if (maxId.Any())
                {
                    var numbers = maxId
                        .Where(id => id.StartsWith("VID"))
                        .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                        .Where(num => num > 0);

                    if (numbers.Any())
                        nextNumber = numbers.Max() + 1;
                }

                var newId = $"VID{nextNumber:D7}";

                var video = new VideoLesson
                {
                    VideoID = newId,
                    ChapterID = request.ChapterID,
                    Title = request.Title,
                    VideoURL = request.VideoURL,
                    DurationMinutes = request.DurationMinutes
                };

                _context.VideoLessons.Add(video);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = newId }, video);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating video lesson", error = ex.Message });
            }
        }

        // PUT: api/VideoLesson/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateVideoLessonRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var video = await _context.VideoLessons.FindAsync(id);
                if (video == null)
                    return NotFound(new { message = "Video lesson not found" });

                // Validate chapter if changed
                if (request.ChapterID != null && request.ChapterID != video.ChapterID)
                {
                    var chapter = await _context.Chapters.FindAsync(request.ChapterID);
                    if (chapter == null)
                        return BadRequest(new { message = "Chapter not found" });

                    video.ChapterID = request.ChapterID;
                }

                if (request.Title != null)
                    video.Title = request.Title;

                if (request.VideoURL != null)
                    video.VideoURL = request.VideoURL;

                if (request.DurationMinutes.HasValue)
                    video.DurationMinutes = request.DurationMinutes.Value;

                await _context.SaveChangesAsync();

                return Ok(video);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating video lesson", error = ex.Message });
            }
        }

        // DELETE: api/VideoLesson/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var video = await _context.VideoLessons.FindAsync(id);
                if (video == null)
                    return NotFound(new { message = "Video lesson not found" });

                _context.VideoLessons.Remove(video);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Video lesson deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting video lesson", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateVideoLessonRequest
    {
        public string ChapterID { get; set; } = null!;
        public string Title { get; set; } = null!;
        public string VideoURL { get; set; } = null!;
        public int DurationMinutes { get; set; }
    }

    public class UpdateVideoLessonRequest
    {
        public string? ChapterID { get; set; }
        public string? Title { get; set; }
        public string? VideoURL { get; set; }
        public int? DurationMinutes { get; set; }
    }
}
