using System.Security.Claims;
using API.Context;
using API.Controllers;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public partial class PostController : BaseController
{
    protected DataContext _context;


    public PostController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpPost("Create")]
    public async Task<ActionResult> CreatePost(PostDTO postDTO)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        UserEntity user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return BadRequest("Invalid Request!");

        DateTime dateTime = DateTime.UtcNow;

        await _context.Posts.AddAsync(new PostEntity
        {
            Title = postDTO.Title,
            Message = postDTO.Message,
            Date = dateTime,
            UserEntity = user
        });

        await _context.SaveChangesAsync();

        return Ok("Post sucessfully created!");
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetPost(int id)
    {
        var post = await _context.Posts
                                 .Include(p => p.UserEntity)
                                 .Select(p => new { p.Id, p.Title, p.Message, p.Date, p.UserEntity.UserName })
                                 .FirstOrDefaultAsync(p => p.Id == id);

        if (post == null) return BadRequest("Post does not Exist!");
        var commentEntities = await _context.Comments
                                        .Include(c => c.UserEntity)
                                        .Where(c => c.PostEntityId == post.Id)
                                        .ToListAsync();

        var postWithComments = new PostDTO(commentEntities)
        {
            Id = post.Id,
            Title = post.Title,
            Message = post.Message,
            Date = post.Date,
            UserName = post.UserName,
        };

        return Ok(postWithComments);
    }

    [HttpGet]
    public async Task<ActionResult> GetPosts()
    {
        var posts = await _context.Posts.Include(p => p.UserEntity)
            .Select(p => new { p.Id, p.Title, p.Message, p.Date, p.UserEntity.UserName })
            .ToListAsync();

        return Ok(posts);
    }

    [Authorize]
    [HttpPut("Update")]
    public async Task<ActionResult> UpdatePost(PostDTO postDto)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        if (userId == -1) return BadRequest("Unable to Update Post");

        var post = await FindPost(postDto.Id);
        if (post == null) return BadRequest("Post Not Found!");
        if (post.UserEntityId != userId) return Unauthorized("You cannot edit this post!");
        post.Message = postDto.Message;

        var updatedPost = _context.Posts.Update(post);
        if (updatedPost == null) return BadRequest("Unable to Update Post!");

        await _context.SaveChangesAsync();

        return Ok("Post Successfully Updated!");

    }

    [Authorize]
    [HttpDelete("Delete")]
    public async Task<ActionResult> DeletePost(int id)
    {
        int userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        if (userId == -1) return BadRequest("Unable to Delete Post");

        Console.WriteLine(id);
        var post = await FindPost(id);


        if (post == null) return BadRequest(id);
        if (post.UserEntityId != userId) return Unauthorized("You cannot delete this post!");

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();

        return Ok("Post successfully deleted!");
    }

    [HttpGet("Search")]
    public async Task<ActionResult> SearchPosts([FromQuery] string title)
    {
        var posts = await Task.Run(() => _context.Posts
        .Select(post => new { post.Id, post.Message, post.Title, post.UserEntity.UserName })
        .Where(post => post.Title.ToLower().Contains(title.ToLower()))
        .ToList());


        return Ok(posts);
    }

    private async Task<PostEntity> FindPost(int id)
    {
        return await _context.Posts.FirstOrDefaultAsync(p => p.Id == id);
    }

    private async Task<UserEntity> FindUser(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

}
