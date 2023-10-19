using System.Drawing;
using System.Security.Cryptography;
using System.Text;
using API.Context;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController : BaseController
{
    private DataContext _context;
  
    private TokenService _tokenService;

    public AccountController(DataContext context, IConfiguration config)
    {
        _context = context;
        _tokenService = new TokenService(config);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username Already Exists!");

        var size = 64;
        var salt = RandomNumberGenerator.GetBytes(size);
        var user = new UserEntity()
        {
            UserName = registerDto.Username,
            PasswordHash = HashPassword(registerDto.Password, salt),
            PasswordSalt = salt
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return new UserDto
        {
            Username = registerDto.Username,
            Token = _tokenService.CreateToken(user)
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        if (await VerifyPassword(loginDto) == false) return Unauthorized("Invalid Username or Password");
        var user = await FindUsername(loginDto.Username);

        return Ok(new UserDto
        {
            Username = loginDto.Username.ToLower(),
            Token = _tokenService.CreateToken(user)
        });
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
