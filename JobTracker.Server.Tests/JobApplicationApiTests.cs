using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using Xunit;

namespace JobTracker.Server.Tests
{
    public class JobApplicationApiTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;

        public JobApplicationApiTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAllApplications_ReturnsOk()
        {
            var response = await _client.GetAsync("/api/JobApplication");

            var content = await response.Content.ReadAsStringAsync();

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            Assert.NotEmpty(content); // Make sure we got data back
        }
    }
}
