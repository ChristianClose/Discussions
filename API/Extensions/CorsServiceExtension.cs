namespace API;

public static class CorsServiceExtension
{ 
     public static IServiceCollection AddCorsService (this IServiceCollection services, IConfiguration configuration)
     {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(
                policy =>
                {
                    policy.WithOrigins("http://localhost:4200",
                                        "https://https://localhost:4200")
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                }
            );
        });

        return services;
     }
}
