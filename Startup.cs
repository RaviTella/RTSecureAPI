using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace RTSecureAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAuthentication(AzureADDefaults.JwtBearerAuthenticationScheme)
           .AddAzureADBearer(options => Configuration.Bind("AzureAd", options));
            services.AddCors(options =>
            {
                options.AddPolicy("foo",
                builder =>
                {
                    // Not a permanent solution, but just trying to isolate the problem
                    //builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    builder.WithOrigins("http://localhost:8080").AllowAnyMethod().AllowAnyHeader();
                });
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("rtgroup1", policy => policy.RequireRole("7ecca800-fdf2-4c6f-bbc2-394902d2d50d"));
                options.AddPolicy("rtgroup2", policy => policy.RequireRole("f39c8767-1fee-4758-845c-643614bad1d0"));
                options.AddPolicy("both", policy =>
                  policy.RequireRole("7ecca800-fdf2-4c6f-bbc2-394902d2d50d", "f39c8767-1fee-4758-845c-643614bad1d0"));
            });

            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors("foo");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
