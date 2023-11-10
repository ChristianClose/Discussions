public class CommentDto
{
    public int Id { get; set; }
    public string Comment { get; set; }

    public int ParentCommentId { get; set; }
}