using System.Security.Cryptography;

namespace PharmaCare.Api.Services;

public class AdminSessionService
{
    private readonly HashSet<string> _tokens = new();

    public string CreateToken()
    {
        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        lock (_tokens)
        {
            _tokens.Add(token);
        }

        return token;
    }

    public bool IsValidToken(string? token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        lock (_tokens)
        {
            return _tokens.Contains(token);
        }
    }
}
