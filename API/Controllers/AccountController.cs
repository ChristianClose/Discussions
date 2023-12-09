using System.Drawing;
using System.Security.Cryptography;
using System.Text;
using API.Context;
using API.Entities;
using API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Security.Claims;

namespace API.Controllers;

public class AccountController : BaseController
{
    private const int SALT_SIZE = 64;
    private readonly DataContext _context;
  
    private readonly TokenService _tokenService;

    public AccountController(DataContext context, IConfiguration config)
    {
        _context = context;
        _tokenService = new TokenService(config);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username Already Exists!");

        var salt = RandomNumberGenerator.GetBytes(SALT_SIZE);
        var user = new UserEntity()
        {
            UserName = registerDto.Username,
            PasswordHash = HashPassword(registerDto.Password, salt),
            PasswordSalt = salt
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        var userDto = new UserDto
        {
            Username = registerDto.Username,
            Token = _tokenService.CreateToken(user)
        }; 

        return Ok(userDto);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        if (await VerifyPassword(loginDto) == false) return Unauthorized("Invalid Username or Password");
        var user = await FindUsername(loginDto.Username);

        var userDto = new UserDto
        {
            Username = loginDto.Username.ToLower(),
            Token = _tokenService.CreateToken(user)
        };

        return Ok(userDto);
    }

    [HttpPut("update")]
    public async Task<ActionResult> Update(AccountUpdateDto updateDto)
    {
        if(updateDto.password == null) return BadRequest("Password is requred");
        var userId = parseUserNameIdentifier(ClaimTypes.NameIdentifier);
        
        if(userId == -1) return NotFound("User not found");

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if(user == null) return Unauthorized("You are not authorized to do this");

        var salt = RandomNumberGenerator.GetBytes(SALT_SIZE);
        user.PasswordHash = HashPassword(updateDto.password, salt);
        user.PasswordSalt = salt;
        
        _context.Update(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    private async Task<UserEntity> FindUsername(string Username)
    {
        return await _context.Users.FirstOrDefaultAsync(x => x.UserName.ToLower() == Username.ToLower());
    }

    private async Task<bool> VerifyPassword(LoginDto loginDto)
    {
        var user = await FindUsername(loginDto.Username);
        if (user == null) return false;

        byte[] hashedPassword = HashPassword(loginDto.Password, user.PasswordSalt);

        for (int i = 0; i < hashedPassword.Length; i++)
        {
            if (hashedPassword[i] != user.PasswordHash[i]) return false;
        }

        return true;
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }


}
