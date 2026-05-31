using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmaCare.Api.Data;
using PharmaCare.Api.Models;
using PharmaCare.Api.Services;

namespace PharmaCare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AdminSessionService _adminSessions;

    public AuthController(AppDbContext context, AdminSessionService adminSessions)
    {
        _context = context;
        _adminSessions = adminSessions;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AdminLoginRequest request)
    {
        var username = request.Username.Trim();
        var password = request.Password.Trim();

        var admin = await _context.Admins
            .AsNoTracking()
            .FirstOrDefaultAsync(existing =>
                existing.Username == username &&
                existing.Password == password);

        if (admin is null)
        {
            return Unauthorized(new { message = "Wrong username or password." });
        }

        return Ok(new
        {
            message = "Admin login successful.",
            token = _adminSessions.CreateToken(),
            admin = new
            {
                admin.Id,
                admin.Username
            }
        });
    }
}
