// Controllers/PostController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class PostController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PostController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Post/user/{userId} - Endpoint chính cho FE
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserPosts(string userId)
    {
        try
        {
            var posts = await _context.Posts
                .Where(p => p.UserID == userId)
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.PostID,
                    p.Title,
                    p.Content,
                    p.UserID,
                    p.CreatedAt,
                    User = new
                    {
                        p.User!.UserID,
                        p.User.AccountName,
                        p.User.FullName
                    }
                })
                .ToListAsync();

            return Ok(posts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving posts", error = ex.Message });
        }
    }

    // GET: api/Post?sortBy=date|title&sortOrder=asc|desc
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? sortBy = "date", [FromQuery] string? sortOrder = "desc")
    {
        try
        {
            var query = _context.Posts
                .Include(p => p.User)
                .AsQueryable();

            // Apply sorting
            query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
            {
                ("date", "asc") => query.OrderBy(p => p.CreatedAt),
                ("date", _) => query.OrderByDescending(p => p.CreatedAt),
                ("title", "desc") => query.OrderByDescending(p => p.Title),
                ("title", "asc") => query.OrderBy(p => p.Title),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var posts = await query.ToListAsync();

            return Ok(posts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving posts", error = ex.Message });
        }
    }

    // GET: api/Post/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        try
        {
            var post = await _context.Posts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostID == id);

            if (post == null)
                return NotFound(new { message = "Post not found" });

            return Ok(post);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving post", error = ex.Message });
        }
    }

    // POST: api/Post
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePostRequest request)
    {
        try
        {
            // Validate author exists
            var author = await _context.UserTable.FindAsync(request.UserID);
            if (author == null)
                return BadRequest(new { message = "User not found" });

            // Generate new ID
            var maxId = await _context.Posts
                .Select(p => p.PostID)
                .ToListAsync();

            int nextNumber = 1;
            if (maxId.Any())
            {
                var numbers = maxId
                    .Where(id => id.StartsWith("PST"))
                    .Select(id => int.TryParse(id.Substring(3), out int num) ? num : 0)
                    .Where(num => num > 0);

                if (numbers.Any())
                    nextNumber = numbers.Max() + 1;
            }

            var newId = $"PST{nextNumber:D4}";

            var post = new Post
            {
                PostID = newId,
                Title = request.Title,
                Content = request.Content,
                UserID = request.UserID,
                CreatedAt = DateTime.Now
            };

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            // Return created post with author info
            var createdPost = await _context.Posts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostID == newId);

            return CreatedAtAction(nameof(GetById), new { id = newId }, createdPost);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error creating post", error = ex.Message });
        }
    }

    // PUT: api/Post/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdatePostRequest request)
    {
        try
        {
            var existing = await _context.Posts.FindAsync(id);
            if (existing == null)
                return NotFound(new { message = "Post not found" });

            // Update fields
            existing.Title = request.Title ?? existing.Title;
            existing.Content = request.Content ?? existing.Content;

            await _context.SaveChangesAsync();

            var updatedPost = await _context.Posts
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.PostID == id);

            return Ok(updatedPost);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error updating post", error = ex.Message });
        }
    }

    // DELETE: api/Post/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
                return NotFound(new { message = "Post not found" });

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Post deleted successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error deleting post", error = ex.Message });
        }
    }

    // GET: api/Post/search?keyword=xxx
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        try
        {
            var posts = await _context.Posts
                .Include(p => p.User)
                .Where(p => p.Title.Contains(keyword) || p.Content.Contains(keyword))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error searching posts", error = ex.Message });
        }
    }
}

// Request DTOs
public class CreatePostRequest
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string UserID { get; set; } = null!;
}

public class UpdatePostRequest
{
    public string? Title { get; set; }
    public string? Content { get; set; }
}
