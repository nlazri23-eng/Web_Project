using System.ComponentModel.DataAnnotations;

namespace PharmaCare.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100000)]
    public decimal Price { get; set; }

    [Required]
    [MaxLength(80)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(300)]
    public string? Img { get; set; }

    public bool Discount { get; set; }
}
