using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Entities;

namespace Products.Api.Endpoints;

public static class NoteEndpoints
{
    public static void MapNoteEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/notes", async (ApplicationDbContext context) =>
        {
            var notes = await context.Notes.ToListAsync();
            return Results.Ok(notes);
        });

        app.MapPost("/notes", async (ApplicationDbContext context, List<Note> notes) =>
        {
            await context.Notes.AddRangeAsync(notes);
            await context.SaveChangesAsync();
            return Results.Created("/notes", notes);
        });

        app.MapDelete("/notes", async (ApplicationDbContext context) =>
        {
            context.Notes.RemoveRange(context.Notes);
            await context.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}
