using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Endpoints;
using Products.Api.Entities;
using Products.Api.Extensions;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddCookie(IdentityConstants.ApplicationScheme);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.
             SetIsOriginAllowed(origin =>
                origin == "http://localhost" ||
                origin == "http://localhost:3000"  
            ) 
            .AllowAnyMethod()
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
        });
});

builder.Services.AddIdentityCore<User>().AddEntityFrameworkStores<ApplicationDbContext>().AddApiEndpoints();
builder.Services.AddDbContext<ApplicationDbContext>(
    options => options.UseSqlite("DataSource=app.db"));

var app = builder.Build();

app.MapGet("users/me", async (ClaimsPrincipal claims, ApplicationDbContext context) =>
{
    string userId = claims.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;

    return await context.Users.FindAsync(userId);
})
.RequireAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.ApplyMigrations();
}
app.UseCors("AllowAll");
app.MapIdentityApi<User>();
app.MapProductEndpoints();
app.MapNoteEndpoints();
app.MapPaymentLinkEndpoints();
app.MapCompanyInfoEndpoints();
app.MapLinkVideoEndpoints();
app.UseAuthorization();


app.Run();
