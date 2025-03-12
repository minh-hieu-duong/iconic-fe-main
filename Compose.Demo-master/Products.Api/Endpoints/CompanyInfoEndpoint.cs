using Microsoft.EntityFrameworkCore;
using Products.Api.Database;
using Products.Api.Entities;

namespace Products.Api.Endpoints
{
    public static class CompanyInfoEndpoints
    {
        public static void MapCompanyInfoEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/company").RequireAuthorization();

            // 📌 Lấy danh sách công ty
            group.MapGet("/", async (ApplicationDbContext context) =>
            {
                var companies = await context.CompanyInfos.ToListAsync();
                return companies.Any() ? Results.Ok(companies) : Results.NotFound("Không tìm thấy dữ liệu.");
            });

            // 📌 Lấy thông tin công ty theo ID
            group.MapGet("/{id:int}", async (int id, ApplicationDbContext context) =>
            {
                var company = await context.CompanyInfos.FindAsync(id);
                return company is not null ? Results.Ok(company) : Results.NotFound("Không tìm thấy công ty.");
            });

            // 📌 Upload ảnh & cập nhật thông tin công ty
            group.MapPost("/upload", async (HttpContext httpContext, ApplicationDbContext context) =>
            {
                var form = await httpContext.Request.ReadFormAsync();
                var file = form.Files.GetFile("image");

                if (file is null || file.Length == 0)
                {
                    return Results.BadRequest("File không hợp lệ.");
                }

                // 📌 Tạo thư mục nếu chưa có
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // 📌 Đặt tên file và lưu vào thư mục
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // 📌 Lưu đường dẫn ảnh vào database
                var company = await context.CompanyInfos.FirstOrDefaultAsync() ?? new CompanyInfo();
                company.ImagePath = $"/uploads/{fileName}";

                if (company.Id == 0)
                    context.CompanyInfos.Add(company);
                else
                    context.CompanyInfos.Update(company);

                await context.SaveChangesAsync();
                return Results.Ok(company);
            })
            .Accepts<IFormFile>("multipart/form-data")
            .Produces<CompanyInfo>(StatusCodes.Status200OK);

            // 📌 Xóa công ty theo ID và xóa ảnh trên server
            group.MapDelete("/{id:int}", async (int id, ApplicationDbContext context) =>
            {
                var company = await context.CompanyInfos.FindAsync(id);
                if (company is null) return Results.NotFound("Không tìm thấy công ty.");

                // 📌 Xóa file ảnh trên server nếu có
                if (!string.IsNullOrEmpty(company.ImagePath))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", company.ImagePath.TrimStart('/'));
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                }

                context.CompanyInfos.Remove(company);
                await context.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
