using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace API.DTOs;

public class LoginDto
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
}
