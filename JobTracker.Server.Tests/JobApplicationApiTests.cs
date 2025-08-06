using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using Xunit;
using JobTracker.Server.Models;
using System.Text.Json;

namespace JobTracker.Server.Tests
{
    public class TestWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                // This is where you'd inject test services
                // For now, we're just marking this as the test environment
                // Your controller logic will need to detect this and use test data
            });
        }
    }

    public class JobApplicationApiTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public JobApplicationApiTests(TestWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAllApplications_ReturnsOk()
        {
            var response = await _client.GetAsync("/api/JobApplication");
            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotEmpty(content);

            // Let's also verify we got valid JSON back
            var applications = JsonSerializer.Deserialize<JobApplication[]>(content);
            Assert.NotNull(applications);
            Assert.True(applications.Length > 0);
        }
    }
}