using System.ComponentModel.DataAnnotations;

namespace Products.Api.Entities
{
    public class LinkVideo
    {
        [Key]
        public int Id { get; set; }

        public string Url { get; set; } = string.Empty;

        public DateTime DateShow { get; set; }
    }
}
