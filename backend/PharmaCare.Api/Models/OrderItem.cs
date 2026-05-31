using System.ComponentModel.DataAnnotations;

namespace PharmaCare.Api.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int? ProductId { get; set; }

    [Required]
    [MaxLength(120)]
    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public Order? Order { get; set; }
}
