using API.Entities;
using API.DTOs;
using API.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Cryptography;

namespace API.Controllers;

[Authorize(Roles = "Admin")]
public class UsersController : BaseController
{
    private readonly DataContext _context;

    public UsersController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserEntity>>> GetUsers()
    {
        var users = await _context.Users.ToListAsync<UserEntity>();

        return users;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserEntity>> GetUser(int id)
    {
        var user = await FindUser(id);

        if (user == null) return BadRequest("User does not exist!");

        return user;
    }

    [HttpPost("create")]
    public async Task<ActionResult<UserEntity>> CreateUser(RegisterDto userDto)
    {
        Console.WriteLine(userDto.Username);
        userDto.Username = userDto.Username.ToLower();
        if (await UserExists(userDto.Username)) return BadRequest("Username is taken!");

        var size = 64;
        var salt = RandomNumberGenerator.GetBytes(size);

        var user = new UserEntity
        {
            UserName = userDto.Username,
            PasswordHash = HashPassword(userDto.Password, salt),
            PasswordSalt = salt
        };


        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return Ok("User Created!");
    }

    [HttpPut("update")]
    public async Task<ActionResult> UpdateUser(UserEntity user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return Ok("User Updated");
    }

    [HttpDelete("delete")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await FindUser(id);

        if (user == null) return BadRequest("User not found!");

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok("User successfully deleted");
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }

    private async Task<UserEntity> FindUser(int id)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
    }
}
