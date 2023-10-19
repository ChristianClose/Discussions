using System.ComponentModel.DataAnnotations;
using API.Entities;

namespace API;

public class PostEntity
{
    public int Id { get; set; }

    [Required]
    public string Title { get; set; }

    [Required]
    public string Message { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public int UserEntityId { get; set; }

    [Required]
    public UserEntity UserEntity { get; set; }

}
