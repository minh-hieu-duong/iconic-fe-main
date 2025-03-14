using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Products.Api.Entities;
using System.Reflection.Emit;

namespace Products.Api.Database;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Note>().HasData(new Note { Id = 1, Content = "Welcome to the shared note!" });
        builder.HasDefaultSchema("identity");
    }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<LinkVideo> LinkVideos { get; set; }
    public DbSet<CompanyInfo> CompanyInfos { get; set; }
    public DbSet<PaymentLink> PaymentLinks { get; set; }
}