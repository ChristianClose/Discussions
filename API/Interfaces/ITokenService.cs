﻿using API.Entities;

namespace API;

public interface ITokenService
{
    public string CreateToken(UserEntity user);
}
