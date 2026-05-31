using System.ComponentModel.DataAnnotations;

namespace PharmaCare.Api.Models;

public class CreateOrderRequest
{
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public List<CreateOrderItemRequest> Items { get; set; } = new();
}
