using System.ComponentModel.DataAnnotations;

namespace API;

public class PostDTO
{
    public int Id { get; set; }

    public string Title { get; set; }

    [Required]
    public string Message { get; set; }

    public string Date { get; set; }

    public string Username { get; set; }

    public CommentEntity[] Comments { get; set; }


}
