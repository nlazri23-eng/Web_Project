using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using PharmaCare.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<PharmaCare.Api.Services.AdminSessionService>();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost",
                "http://127.0.0.1",
                "http://localhost:5500",
                "http://127.0.0.1:5500")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "wwwroot"));

var app = builder.Build();
var frontendRoot = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", ".."));

app.UseCors("Frontend");
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(frontendRoot, "css")),
    RequestPath = "/css"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(frontendRoot, "js")),
    RequestPath = "/js"
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.Combine(frontendRoot, "images")),
    RequestPath = "/images"
});
app.MapControllers();
app.MapGet("/", () => Results.File(Path.Combine(frontendRoot, "index.html"), "text/html"));
app.MapGet("/index.html", () => Results.File(Path.Combine(frontendRoot, "index.html"), "text/html"));
app.MapGet("/admin.html", () => Results.File(Path.Combine(frontendRoot, "admin.html"), "text/html"));
app.MapGet("/style.css", () => Results.File(Path.Combine(frontendRoot, "style.css"), "text/css"));
app.MapGet("/script.js", () => Results.File(Path.Combine(frontendRoot, "script.js"), "application/javascript"));

app.Run();
