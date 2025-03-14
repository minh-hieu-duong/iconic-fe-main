using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Entities;

namespace Products.Api.Endpoints;

public static class PaymentLinkEndpoints
{
    public static void MapPaymentLinkEndpoints(this IEndpointRouteBuilder app)
    {
        // 📌 Lấy danh sách payment link
        app.MapGet("/payment-links", async (ApplicationDbContext context) =>
        {
            var links = await context.PaymentLinks.ToListAsync();
            return Results.Ok(links);
        });

        // 📌 Thêm một hoặc nhiều payment link
        app.MapPost("/payment-links", async (ApplicationDbContext context, List<PaymentLink> links) =>
        {
            await context.PaymentLinks.AddRangeAsync(links);
            await context.SaveChangesAsync();
            return Results.Created("/payment-links", links);
        });
    }
}
