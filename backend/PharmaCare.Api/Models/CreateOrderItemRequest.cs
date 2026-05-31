namespace PharmaCare.Api.Models;

public class CreateOrderItemRequest
{
    public int? ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public int Quantity { get; set; }
}
