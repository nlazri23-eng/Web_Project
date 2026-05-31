using System.ComponentModel.DataAnnotations;

namespace PharmaCare.Api.Models;

public class AdminLoginRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
