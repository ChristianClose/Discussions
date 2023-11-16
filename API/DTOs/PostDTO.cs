using System.ComponentModel.DataAnnotations;
using API.DTOs;

namespace API;

public class PostDTO
{
    public int Id { get; set; }

    public string Title { get; set; }

    [Required]
    public string Message { get; set; }

    public DateTime Date { get; set; }

    public string Username { get; set; }

    public List<CommentDto> Comments { get; set; }

    public PostDTO(){}
    public PostDTO(List<CommentEntity> commentEntities)
    {
        SetComments(commentEntities);
    }

    private List<CommentDto> SetComments(List<CommentEntity> commentEntities) 
    {
        var commentDictionary = commentEntities.ToDictionary(c => c.Id, c => new CommentDto
        {
            Id = c.Id,
            Comment = c.Comment,
            UserName = c.UserEntity.UserName,
            Date = c.Date,
            ParentCommentId = c.ParentCommentId,
            Children = new List<CommentDto>()
        });

        Comments = new List<CommentDto>();

        foreach (var comment in commentDictionary.Values)
        {
            if (comment.ParentCommentId > 0 && commentDictionary.TryGetValue(comment.ParentCommentId, out var parentComment))
            {
                parentComment.Children.Add(comment);
            }
            else
            {
                Comments.Add(comment);
            }
        }
        return Comments;
    }


}
