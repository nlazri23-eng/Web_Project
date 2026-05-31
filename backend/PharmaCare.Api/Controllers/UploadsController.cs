using Microsoft.AspNetCore.Mvc;
using PharmaCare.Api.Services;

namespace PharmaCare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadsController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    };

    private readonly IWebHostEnvironment _environment;
    private readonly AdminSessionService _adminSessions;

    public UploadsController(IWebHostEnvironment environment, AdminSessionService adminSessions)
    {
        _environment = environment;
        _adminSessions = adminSessions;
    }

    [HttpPost("product-image")]
    public async Task<IActionResult> UploadProductImage(IFormFile image)
    {
        if (!IsAdminRequest())
        {
            return Unauthorized();
        }

        if (image.Length == 0)
        {
            return BadRequest(new { message = "Image file is required." });
        }

        var extension = Path.GetExtension(image.FileName);
        if (!AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Only JPG, PNG, and WEBP images are allowed." });
        }

        var webRootPath = _environment.WebRootPath ??
            Path.Combine(_environment.ContentRootPath, "wwwroot");
        var uploadsFolder = Path.Combine(webRootPath, "uploads", "products");
        Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await image.CopyToAsync(stream);
        }

        var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/products/{fileName}";
        return Ok(new { img = imageUrl });
    }

    private bool IsAdminRequest()
    {
        return Request.Headers.TryGetValue("X-Admin-Token", out var token) &&
            _adminSessions.IsValidToken(token.ToString());
    }
}
