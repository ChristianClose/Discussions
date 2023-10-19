namespace API.Entities;

public class UserEntity
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Role { get; set; } = "User";
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }

}
