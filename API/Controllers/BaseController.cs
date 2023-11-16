using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{

    protected byte[] HashPassword(string password, byte[] salt)
    {
        int size = salt.Length;
        int iterations = 500_000;
        HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;
        var passwordBytes = Encoding.UTF8.GetBytes(password);

        return Rfc2898DeriveBytes.Pbkdf2(
            passwordBytes,
            salt,
            iterations,
            hashAlgorithm,
            size
         );
    }

    protected int parseUserNameIdentifier(string nameIdentifier)
    {
        int userId;
        var parseSuccess = int.TryParse(User.FindFirstValue(nameIdentifier), out userId);
        if (!parseSuccess) return -1;

        return userId;
    }
}

