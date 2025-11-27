using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CommentController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Comment/post/{postId}?sortBy=date&sortOrder=asc|desc
        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetByPost(string postId, [FromQuery] string? sortBy = "date", [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.Comments
                    .Where(c => c.PostID == postId)
                    .Include(c => c.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("date", "asc") => query.OrderBy(c => c.CreatedAt),
                    ("date", _) => query.OrderByDescending(c => c.CreatedAt),
                    _ => query.OrderByDescending(c => c.CreatedAt)
                };

                var comments = await query.ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving comments", error = ex.Message });
            }
        }

        // GET: api/Comment/course/{courseId}?sortBy=date&sortOrder=asc|desc
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(string courseId, [FromQuery] string? sortBy = "date", [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.Comments
                    .Where(c => c.CourseID == courseId)
                    .Include(c => c.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("date", "asc") => query.OrderBy(c => c.CreatedAt),
                    ("date", _) => query.OrderByDescending(c => c.CreatedAt),
                    _ => query.OrderByDescending(c => c.CreatedAt)
                };

                var comments = await query.ToListAsync();

                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving comments", error = ex.Message });
            }
        }

        // POST: api/Comment
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCommentRequest request)
        {
            try
            {
                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                // Validate post or course exists
                if (!string.IsNullOrEmpty(request.PostID))
                {
                    var post = await _context.Posts.FindAsync(request.PostID);
                    if (post == null)
                        return BadRequest(new { message = "Post not found" });
                }

                if (!string.IsNullOrEmpty(request.CourseID))
                {
                    var course = await _context.Courses.FindAsync(request.CourseID);
                    if (course == null)
                        return BadRequest(new { message = "Course not found" });
                }

                var comment = new Comment
                {
                    UserID = request.UserID,
                    CreatedAt = DateTime.Now,
                    Content = request.Content,
                    PostID = request.PostID,
                    CourseID = request.CourseID,
                    ReplyUserID = request.ReplyUserID,
                    ReplyCreatedAt = request.ReplyCreatedAt
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                var createdComment = await _context.Comments
                    .Include(c => c.User)
                    .FirstOrDefaultAsync(c => c.UserID == request.UserID && c.CreatedAt == comment.CreatedAt);

                return Ok(createdComment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating comment", error = ex.Message });
            }
        }

        // DELETE: api/Comment
        [HttpDelete]
        public async Task<IActionResult> Delete([FromBody] DeleteCommentRequest request)
        {
            try
            {
                var comment = await _context.Comments
                    .FirstOrDefaultAsync(c => c.UserID == request.UserID && c.CreatedAt == request.CreatedAt);

                if (comment == null)
                    return NotFound(new { message = "Comment not found" });

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting comment", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateCommentRequest
    {
        public string UserID { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? PostID { get; set; }
        public string? CourseID { get; set; }
        public string? ReplyUserID { get; set; }
        public DateTime? ReplyCreatedAt { get; set; }
    }

    public class DeleteCommentRequest
    {
        public string UserID { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}
