using API;

public class CommentDto
{
    public int Id { get; set; }
    public string Comment { get; set; }
    public string UserName { get; set; }
    public DateTime Date { get; set; }
    public int ParentCommentId { get; set; }
    public List<CommentDto> Children { get; set; }
}