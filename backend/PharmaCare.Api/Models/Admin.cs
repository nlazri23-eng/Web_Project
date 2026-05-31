using System.ComponentModel.DataAnnotations;

namespace PharmaCare.Api.Models;

public class Admin
{
    public int Id { get; set; }

    [Required]
    [MaxLength(80)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;
}
