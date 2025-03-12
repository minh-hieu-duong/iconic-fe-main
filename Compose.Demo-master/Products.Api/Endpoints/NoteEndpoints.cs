using Microsoft.EntityFrameworkCore;
using Products.Api.Database;

namespace Products.Api.Endpoints;

public static class NoteEndpoints
{
    public static void MapNoteEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/note", async (ApplicationDbContext context) =>
        {
            var note = await context.Notes.FirstOrDefaultAsync(n => n.Id == 1);
            return Results.Ok(note);
        });

        app.MapPut("/note", async (ApplicationDbContext context, string newContent) =>
        {
            var note = await context.Notes.FirstOrDefaultAsync(n => n.Id == 1);
            if (note is null) return Results.NotFound();

            note.Content = newContent;
            await context.SaveChangesAsync();

            return Results.Ok(note);
        });
    }
}
