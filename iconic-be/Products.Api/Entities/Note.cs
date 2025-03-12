using System.ComponentModel.DataAnnotations;

namespace Products.Api.Entities
{
    public class Note
    {
        [Key]
        public int Id { get; set; } = 1; 

        [Required]
        public string Content { get; set; } = string.Empty;
    }

}
