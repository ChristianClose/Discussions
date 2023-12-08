using System.Security.Claims;
using API.Context;
using API.Controllers;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public partial class PostController
{

    [Authorize]
    [HttpPost("{postId}/Comment")]
    public async Task<ActionResult> AddComment(int postId, CommentDto comment)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        if (userId == -1) return BadRequest("Unable to Post Comment");

        DateTime dateTime = DateTime.UtcNow;
        UserEntity user = await this._context.Users.FirstOrDefaultAsync(user => user.Id == userId);
        PostEntity post = await _context.Posts.FirstOrDefaultAsync(post => post.Id == postId);

        if (user == null || post == null) return BadRequest("Invalid User or Post");

        CommentEntity commentEntity = new()
        {
            UserEntityId = userId,
            UserEntity = user,
            PostEntityId = postId,
            PostEntity = post,
            Comment = comment.Comment,
            ParentCommentId = comment.ParentCommentId,
            Date = dateTime
        };

        await _context.Comments.AddAsync(commentEntity);
        await _context.SaveChangesAsync();

        return Ok("Comment Successfully Added To Post");
    }

    [Authorize]
    [HttpDelete("{postId}/Comment")]
    public async Task<ActionResult> DeleteComment(int postId, int id)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        if (userId == -1) return Unauthorized("You are not authorized to delete this comment");
        var comment = await _context.Comments.FirstOrDefaultAsync(comment => comment.Id == id);
        if (comment == null) return BadRequest("Invalid Comment");
        if (comment.UserEntityId != userId) return Unauthorized("You are not authorized to delete this comment");

        await _context.Comments.Where(comment => comment.Id == id).ExecuteDeleteAsync();
        await _context.SaveChangesAsync();

        return Ok("Comment successfully deleted");
    }

    [Authorize]
    [HttpPut("{postId}/Comment")]
    public async Task<ActionResult> UpdateComment(int postId, int id, [FromBody] string comment)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        if (userId == -1) return Unauthorized("You are not authorized to update this comment");
        var commentEntity = await _context.Comments.FirstOrDefaultAsync(comment => comment.Id == id);

        if (commentEntity == null) return BadRequest("Invalid Comment");
        if (commentEntity.UserEntityId != userId) return Unauthorized("You are not authorized to delete this comment");

        commentEntity.Comment = comment;
        _context.Comments.Update(commentEntity);
        await _context.SaveChangesAsync();

        return Ok("Comment Successfully updated");
    }
}
