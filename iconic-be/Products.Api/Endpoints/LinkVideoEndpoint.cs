using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Entities;

namespace Products.Api.Endpoints;

public static class LinkVideoEndpoints
{
    public static void MapLinkVideoEndpoints(this IEndpointRouteBuilder app)
    {
        // 📌 Lấy danh sách link video
        app.MapGet("/videos", async (ApplicationDbContext context) =>
        {
            var videos = await context.LinkVideos.ToListAsync();
            return Results.Ok(videos);
        });

        // 📌 Thêm một hoặc nhiều link video
        app.MapPost("/videos", async (ApplicationDbContext context, List<LinkVideo> videos) =>
        {
            await context.LinkVideos.AddRangeAsync(videos);
            await context.SaveChangesAsync();
            return Results.Created("/videos", videos);
        });

        // 📌 Xóa link video theo ID
        app.MapDelete("/videos/{id}", async (int id, ApplicationDbContext context) =>
        {
            var video = await context.LinkVideos.FindAsync(id);
            if (video is null) return Results.NotFound();

            context.LinkVideos.Remove(video);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
