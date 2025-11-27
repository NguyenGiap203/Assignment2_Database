using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElearningBackend.Data;
using ElearningBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace ElearningBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        // In-memory session storage (for simple implementation)
        private static readonly Dictionary<string, SessionInfo> _activeSessions = new();

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Check for hardcoded sManager account (as per assignment requirement)
                if (request.Username == "sManager" && request.Password == "sManager")
                {
                    var sessionToken = GenerateSessionToken();
                    var session = new SessionInfo
                    {
                        Username = "sManager",
                        Role = "Admin",
                        LoginTime = DateTime.Now,
                        Token = sessionToken
                    };

                    _activeSessions[sessionToken] = session;

                    return Ok(new LoginResponse
                    {
                        Success = true,
                        Message = "Login successful",
                        Token = sessionToken,
                        Username = "sManager",
                        Role = "Admin"
                    });
                }

                // Check database for regular users
                var user = await _context.UserTable
                    .FirstOrDefaultAsync(u => u.AccountName == request.Username);

                if (user == null)
                    return Unauthorized(new { success = false, message = "Invalid username or password" });

                // Verify password (simple comparison - in production use hashing)
                if (user.AccountPassword != request.Password)
                    return Unauthorized(new { success = false, message = "Invalid username or password" });

                // Check if account is active
                if (!user.AccountState)
                    return Unauthorized(new { success = false, message = "Account is not active" });

                // Generate session token
                var token = GenerateSessionToken();
                var userSession = new SessionInfo
                {
                    Username = user.AccountName,
                    UserId = user.UserID,
                    Role = "User", // Default role for regular users
                    LoginTime = DateTime.Now,
                    Token = token
                };

                _activeSessions[token] = userSession;

                return Ok(new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    Username = user.AccountName,
                    UserId = user.UserID,
                    Role = "User",
                    Fullname = user.FullName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error during login", error = ex.Message });
            }
        }

        // POST: api/Auth/Logout
        [HttpPost("Logout")]
        public IActionResult Logout([FromBody] LogoutRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Token))
                    return BadRequest(new { success = false, message = "Token is required" });

                if (_activeSessions.ContainsKey(request.Token))
                {
                    _activeSessions.Remove(request.Token);
                    return Ok(new { success = true, message = "Logout successful" });
                }

                return BadRequest(new { success = false, message = "Invalid token or already logged out" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error during logout", error = ex.Message });
            }
        }

        // GET: api/Auth/Validate - Validate session token
        [HttpGet("Validate")]
        public IActionResult ValidateToken([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                    return BadRequest(new { success = false, message = "Token is required" });

                if (_activeSessions.TryGetValue(token, out var session))
                {
                    // Check if session is still valid (e.g., 24 hours)
                    var sessionDuration = DateTime.Now - session.LoginTime;
                    if (sessionDuration.TotalHours > 24)
                    {
                        _activeSessions.Remove(token);
                        return Unauthorized(new { success = false, message = "Session expired" });
                    }

                    return Ok(new
                    {
                        success = true,
                        username = session.Username,
                        userId = session.UserId,
                        role = session.Role,
                        loginTime = session.LoginTime
                    });
                }

                return Unauthorized(new { success = false, message = "Invalid or expired token" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error validating token", error = ex.Message });
            }
        }

        // GET: api/Auth/ActiveSessions - Get all active sessions (admin only)
        [HttpGet("ActiveSessions")]
        public IActionResult GetActiveSessions()
        {
            try
            {
                var sessions = _activeSessions.Values
                    .Select(s => new
                    {
                        username = s.Username,
                        role = s.Role,
                        loginTime = s.LoginTime,
                        duration = DateTime.Now - s.LoginTime
                    })
                    .ToList();

                return Ok(new { success = true, count = sessions.Count, sessions });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Error retrieving sessions", error = ex.Message });
            }
        }

        // Helper: Generate session token
        private string GenerateSessionToken()
        {
            using (var rng = RandomNumberGenerator.Create())
            {
                var tokenData = new byte[32];
                rng.GetBytes(tokenData);
                return Convert.ToBase64String(tokenData);
            }
        }
    }

    // Request/Response DTOs
    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string? UserId { get; set; }
        public string Role { get; set; } = null!;
        public string? Fullname { get; set; }
    }

    public class LogoutRequest
    {
        public string Token { get; set; } = null!;
    }

    public class SessionInfo
    {
        public string Username { get; set; } = null!;
        public string? UserId { get; set; }
        public string Role { get; set; } = null!;
        public DateTime LoginTime { get; set; }
        public string Token { get; set; } = null!;
    }
}
