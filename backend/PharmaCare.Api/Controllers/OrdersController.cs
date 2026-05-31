using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmaCare.Api.Data;
using PharmaCare.Api.Models;
using PharmaCare.Api.Services;

namespace PharmaCare.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AdminSessionService _adminSessions;

    public OrdersController(AppDbContext context, AdminSessionService adminSessions)
    {
        _context = context;
        _adminSessions = adminSessions;
    }

    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        if (!IsAdminRequest())
        {
            return Unauthorized();
        }

        var orders = await _context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .OrderByDescending(order => order.CreatedAt)
            .Select(order => new
            {
                order.Id,
                date = order.CreatedAt.ToLocalTime().ToString("g"),
                customer = new
                {
                    firstName = order.FirstName,
                    lastName = order.LastName,
                    order.Email,
                    order.Phone,
                    order.Address
                },
                items = order.Items.Select(item => new
                {
                    id = item.ProductId,
                    name = item.ProductName,
                    qty = item.Quantity,
                    item.Price
                }),
                order.Total
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult> CreateOrder(CreateOrderRequest request)
    {
        if (request.Items.Count == 0)
        {
            return BadRequest(new { message = "Order must contain at least one item." });
        }

        var order = new Order
        {
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Email = request.Email.Trim(),
            Phone = request.Phone.Trim(),
            Address = request.Address.Trim(),
            CreatedAt = DateTime.UtcNow,
            Items = request.Items.Select(item => new OrderItem
            {
                ProductId = item.ProductId,
                ProductName = item.ProductName.Trim(),
                Price = item.Price,
                Quantity = item.Quantity
            }).ToList()
        };

        order.Total = order.Items.Sum(item => item.Price * item.Quantity);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, new { order.Id, order.Total });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteOrders()
    {
        if (!IsAdminRequest())
        {
            return Unauthorized();
        }

        await _context.OrderItems.ExecuteDeleteAsync();
        await _context.Orders.ExecuteDeleteAsync();

        return NoContent();
    }

    private bool IsAdminRequest()
    {
        return Request.Headers.TryGetValue("X-Admin-Token", out var token) &&
            _adminSessions.IsValidToken(token.ToString());
    }
}
