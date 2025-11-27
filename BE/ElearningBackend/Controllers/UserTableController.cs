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
        var user = await _context.UserTable.FindAsync(id);
        if (user == null)
            return NotFound();

        _context.UserTable.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted successfully" });
    }
}
