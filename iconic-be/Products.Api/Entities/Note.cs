using System.ComponentModel.DataAnnotations;

namespace Products.Api.Entities
{
    public class Note
    {
        public int Id { get; set; }

        public string Url { get; set; } = string.Empty;
    }

}
