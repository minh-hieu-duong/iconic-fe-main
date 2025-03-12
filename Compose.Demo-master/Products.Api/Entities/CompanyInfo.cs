using System.ComponentModel.DataAnnotations;

namespace Products.Api.Entities
{
    public class CompanyInfo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string ImagePath { get; set; } = string.Empty;
    }
}
