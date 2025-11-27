using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RatingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Rating/course/{courseId}?sortBy=rating&sortOrder=asc|desc
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetByCourse(string courseId, [FromQuery] string? sortBy = "rating", [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.CourseRatings
                    .Where(r => r.CourseID == courseId)
                    .Include(r => r.User)
                    .AsQueryable();

                // Apply sorting
                query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
                {
                    ("rating", "asc") => query.OrderBy(r => r.RatingValue),
                    ("rating", _) => query.OrderByDescending(r => r.RatingValue),
                    _ => query.OrderByDescending(r => r.RatingValue)
                };

                var ratings = await query.ToListAsync();

                return Ok(ratings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving ratings", error = ex.Message });
            }
        }

        // POST: api/Rating
        [HttpPost]
        public async Task<IActionResult> Rate([FromBody] RateCourseRequest request)
        {
            try
            {
                var user = await _context.UserTable.FindAsync(request.UserID);
                if (user == null)
                    return BadRequest(new { message = "User not found" });

                var course = await _context.Courses.FindAsync(request.CourseID);
                if (course == null)
                    return BadRequest(new { message = "Course not found" });

                // Check if rating value is valid (1-5)
                if (request.RatingValue < 1 || request.RatingValue > 5)
                    return BadRequest(new { message = "Rating value must be between 1 and 5" });

                // Check if user already rated this course
                var existing = await _context.CourseRatings
                    .FirstOrDefaultAsync(r => r.UserID == request.UserID && r.CourseID == request.CourseID);

                if (existing != null)
                {
                    // Update existing rating
                    var oldValue = existing.RatingValue ?? 0;
                    existing.RatingValue = request.RatingValue;

                    // Recalculate average rating
                    if (course.NumRatings > 0)
                    {
                        var totalRating = (course.AverageRating * course.NumRatings) - oldValue + request.RatingValue;
                        course.AverageRating = totalRating / course.NumRatings;
                    }

                    await _context.SaveChangesAsync();
                    return Ok(existing);
                }
                else
                {
                    // Create new rating
                    var rating = new CourseRating
                    {
                        UserID = request.UserID,
                        CourseID = request.CourseID,
                        RatingValue = request.RatingValue
                    };

                    _context.CourseRatings.Add(rating);

                    // Update course average rating
                    var totalRating = (course.AverageRating * course.NumRatings) + request.RatingValue;
                    course.NumRatings++;
                    course.AverageRating = totalRating / course.NumRatings;

                    await _context.SaveChangesAsync();

                    return Ok(rating);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error rating course", error = ex.Message });
            }
        }

        // DELETE: api/Rating
        [HttpDelete]
        public async Task<IActionResult> DeleteRating([FromBody] DeleteRatingRequest request)
        {
            try
            {
                var rating = await _context.CourseRatings
                    .FirstOrDefaultAsync(r => r.UserID == request.UserID && r.CourseID == request.CourseID);

                if (rating == null)
                    return NotFound(new { message = "Rating not found" });

                var course = await _context.Courses.FindAsync(request.CourseID);
                if (course != null && course.NumRatings > 0)
                {
                    // Recalculate average rating
                    var totalRating = (course.AverageRating * course.NumRatings) - (rating.RatingValue ?? 0);
                    course.NumRatings--;
                    course.AverageRating = course.NumRatings > 0 ? totalRating / course.NumRatings : 0;
                }

                _context.CourseRatings.Remove(rating);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Rating deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting rating", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class RateCourseRequest
    {
        public string UserID { get; set; } = null!;
        public string CourseID { get; set; } = null!;
        public int RatingValue { get; set; }
    }

    public class DeleteRatingRequest
    {
        public string UserID { get; set; } = null!;
        public string CourseID { get; set; } = null!;
    }
}
