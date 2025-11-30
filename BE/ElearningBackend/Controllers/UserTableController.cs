using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;

[Route("api/[controller]")]
[ApiController]
public class UserTableController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserTableController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/UserTable?sortBy=name|email|date&sortOrder=asc|desc
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? sortBy = "name", [FromQuery] string? sortOrder = "asc")
    {
        var query = _context.UserTable.AsQueryable();

        // Apply sorting
        query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
        {
            ("name", "desc") => query.OrderByDescending(u => u.FullName),
            ("name", _) => query.OrderBy(u => u.FullName),
            ("email", "desc") => query.OrderByDescending(u => u.Email),
            ("email", "asc") => query.OrderBy(u => u.Email),
            ("date", "desc") => query.OrderByDescending(u => u.EnrollmentDate),
            ("date", "asc") => query.OrderBy(u => u.EnrollmentDate),
            ("account", "desc") => query.OrderByDescending(u => u.AccountName),
            ("account", "asc") => query.OrderBy(u => u.AccountName),
            _ => query.OrderBy(u => u.FullName)
        };

        return Ok(await query.ToListAsync());
    }

    // GET: api/UserTable/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _context.UserTable.FindAsync(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/UserTable
    [HttpPost]
    public async Task<IActionResult> Create(UserTable user)
    {
        // Auto-generate UserID if not provided: US + 8 digits (total 10 chars)
        if (string.IsNullOrEmpty(user.UserID))
        {
            var maxId = await _context.UserTable
                .Where(u => u.UserID.StartsWith("US"))
                .Select(u => u.UserID)
                .ToListAsync();

            int nextNumber = 1;
            if (maxId.Any())
            {
                var numbers = maxId
                    .Select(id => int.TryParse(id.Substring(2).Trim(), out int num) ? num : 0)
                    .Where(num => num > 0);
                if (numbers.Any())
                    nextNumber = numbers.Max() + 1;
            }

            user.UserID = $"US{nextNumber:D3}";
        }

        _context.UserTable.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // PUT: api/UserTable/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UserTable user)
    {
        var existing = await _context.UserTable.FindAsync(id);
        if (existing == null)
            return NotFound();

        // Update fields
        existing.AccountName = user.AccountName;
        existing.FullName = user.FullName;
        existing.Email = user.Email;
        existing.PhoneNumber = user.PhoneNumber;
        existing.Nation = user.Nation;
        existing.Province = user.Province;
        existing.Ward = user.Ward;
        existing.EnrollmentDate = user.EnrollmentDate;
        existing.AccountState = user.AccountState;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/UserTable/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.UserTable.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Kiểm tra nếu user là Teacher thì không được xóa nếu có Courses
            var isTeacher = await _context.Teachers.AnyAsync(t => t.TeacherID == id);
            if (isTeacher)
            {
                var hasCourses = await _context.Courses.AnyAsync(c => c.TeacherID == id);
                if (hasCourses)
                {
                    return BadRequest(new { message = "Cannot delete teacher who has courses. Delete courses first." });
                }

                // Xóa Teacher Education records trước
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM TEACHER_EDUCATION WHERE TeacherID = {0}", id);

                // Xóa Practice Attempts của practices của teacher này
                await _context.Database.ExecuteSqlRawAsync(
                    "DELETE FROM PRACTICE_ATTEMPT_INFO WHERE PracticeID IN (SELECT PracticeID FROM PRACTICES WHERE TeacherID = {0})", id);

                // Xóa Practices của teacher
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM PRACTICES WHERE TeacherID = {0}", id);

                // Xóa Teacher record
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM TEACHER WHERE TeacherID = {0}", id);
            }

            // Xóa các data liên quan của User bằng raw SQL
            // 1. Test Attempts
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM TEST_ATTEMPT_RECORDS WHERE UserID = {0}", id);

            // 2. Practice Attempts
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM PRACTICE_ATTEMPT_INFO WHERE UserID = {0}", id);

            // 3. Exercise Attempts
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM EXERCISE_ATTEMPT WHERE UserID = {0}", id);

            // 4. Comments - xóa tất cả comments liên quan (bao gồm cả self-reference)
            // Xóa comments trong posts của user
            await _context.Database.ExecuteSqlRawAsync(
                "DELETE FROM COMMENTS WHERE PostID IN (SELECT PostID FROM POSTS WHERE UserID = {0})", id);

            // Xóa comments của user hoặc reply đến user
            await _context.Database.ExecuteSqlRawAsync(
                "DELETE FROM COMMENTS WHERE UserID = {0} OR ReplyUserID = {0}", id);

            // 5. Posts
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM POSTS WHERE UserID = {0}", id);

            // 6. Enrollments
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM COURSE_ENROLLMENT WHERE UserID = {0}", id);

            // 7. Ratings
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM COURSE_RATING WHERE UserID = {0}", id);

            // 8. Cuối cùng xóa User
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM USERTABLE WHERE UserID = {0}", id);

            await transaction.CommitAsync();
            return Ok(new { message = "User and all related data deleted successfully" });
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "Error deleting user", error = ex.Message, stackTrace = ex.StackTrace });
        }
    }
}
