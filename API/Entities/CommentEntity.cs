using API.Entities;

namespace API;

public class CommentEntity
{
    public int Id { get; set; }
    public int UserEntityId { get; set; }
    public UserEntity UserEntity { get; set; }
    public string Comment { get; set; }
    public DateTime Date { get; set; }

    public int PostEntityId { get; set; }
    public PostEntity PostEntity { get; set; }

    public int ParentCommentId { get; set; }

}
