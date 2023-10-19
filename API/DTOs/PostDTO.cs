using System.ComponentModel.DataAnnotations;

namespace API;

public class PostDTO
{
    public int Id { get; set; }

    public string Title { get; set; }

    [Required]
    public string Message { get; set; }

}
