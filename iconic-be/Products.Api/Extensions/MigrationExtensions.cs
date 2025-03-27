using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Entities;

namespace Products.Api.Extensions;

public static class MigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using IServiceScope scope = app.ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;

        using var dbContext = services.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureCreated();

        // Tạo user mặc định
        var userManager = services.GetRequiredService<UserManager<User>>();
        CreateDefaultUser(userManager).Wait();
    }

    private static async Task CreateDefaultUser(UserManager<User> userManager)
    {
        string email = "admin@gmail.com";
        string password = "Admin@123";

        if (await userManager.FindByEmailAsync(email) == null)
        {
            var user = new User
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                Console.WriteLine("✅ Default admin user created.");
            }
            else
            {
                Console.WriteLine($"❌ Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            Console.WriteLine("ℹ️ Default admin user already exists.");
        }
    }
}
