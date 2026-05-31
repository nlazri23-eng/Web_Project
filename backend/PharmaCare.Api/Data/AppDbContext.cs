using Microsoft.EntityFrameworkCore;
using PharmaCare.Api.Models;

namespace PharmaCare.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.ToTable("login");
            entity.Property(admin => admin.Id).HasColumnName("id");
            entity.Property(admin => admin.Username).HasColumnName("username");
            entity.Property(admin => admin.Password).HasColumnName("password");
            entity.HasIndex(admin => admin.Username).IsUnique();
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");
            entity.Property(product => product.Id).HasColumnName("id");
            entity.Property(product => product.Name).HasColumnName("name");
            entity.Property(product => product.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            entity.Property(product => product.Category).HasColumnName("category");
            entity.Property(product => product.Img).HasColumnName("img");
            entity.Property(product => product.Discount).HasColumnName("discount");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.Property(order => order.Id).HasColumnName("id");
            entity.Property(order => order.FirstName).HasColumnName("first_name");
            entity.Property(order => order.LastName).HasColumnName("last_name");
            entity.Property(order => order.Email).HasColumnName("email");
            entity.Property(order => order.Phone).HasColumnName("phone");
            entity.Property(order => order.Address).HasColumnName("address");
            entity.Property(order => order.Total).HasColumnName("total").HasColumnType("decimal(10,2)");
            entity.Property(order => order.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            entity.Property(item => item.Id).HasColumnName("id");
            entity.Property(item => item.OrderId).HasColumnName("order_id");
            entity.Property(item => item.ProductId).HasColumnName("product_id");
            entity.Property(item => item.ProductName).HasColumnName("product_name");
            entity.Property(item => item.Price).HasColumnName("price").HasColumnType("decimal(10,2)");
            entity.Property(item => item.Quantity).HasColumnName("quantity");
            entity.HasOne(item => item.Order)
                .WithMany(order => order.Items)
                .HasForeignKey(item => item.OrderId);
        });
    }
}
