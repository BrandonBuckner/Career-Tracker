using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Xunit;
using JobTracker.Server.Models;
using JobTracker.Server.Data;
using System.Text.Json;
using System.Net.Http.Json;

namespace JobTracker.Server.Tests
{
    // Test factory that swaps the database to InMemory
    public class TestWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                // Remove existing database configuration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<JobApplicationDBContext>));
                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Covert to in-memory database for testing
                services.AddDbContext<JobApplicationDBContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDatabase");
                });

                // Build service provider
                var serviceProvider = services.BuildServiceProvider();
                using (var scope = serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<JobApplicationDBContext>();

                    // Clear existing data
                    context.Database.EnsureDeleted();
                    context.Database.EnsureCreated();

                    // Adds test data
                    context.JobApplications.AddRange(TestJobApplicationData.GetTestApplications());
                    context.SaveChanges();
                }
            });
        }
    }

    public class JobApplicationUnitTests : IClassFixture<TestWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly TestWebApplicationFactory _factory;

        public JobApplicationUnitTests(TestWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.WithWebHostBuilder(builder => { }).CreateClient();
        }

        [Fact]
        public async Task GetAllApplications_ReturnsOk()
        {
            var response = await _client.GetAsync("/api/JobApplication");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var applications = JsonSerializer.Deserialize<JobApplication[]>(
                await response.Content.ReadAsStringAsync(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Assert.NotNull(applications);
            Assert.Equal(5, applications.Length);
        }

        [Fact]
        public async Task GetApplicationById_ReturnsCorrectApplication()
        {
            var response = await _client.GetAsync("/api/JobApplication/1");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var application = JsonSerializer.Deserialize<JobApplication>(
                await response.Content.ReadAsStringAsync(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Assert.NotNull(application);
            Assert.Equal("Tesla", application.CompanyName);
            Assert.Equal("Software Engineer", application.Role);
            Assert.Equal("Withdrawn", application.Status);
            Assert.False(application.Referral);
            Assert.Equal(new DateTime(2025, 4, 1), application.LastHeardDate);
            Assert.Equal(new DateTime(2025, 3, 2), application.ApplicationDate);
        }

        [Fact]
        public async Task GetApplicationById_NotFound()
        {
            var response = await _client.GetAsync("/api/JobApplication/999");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateApplicationById_ReturnsUpdatedApplication()
        {
            var updatedApplication = new JobApplication
            {
                Id = 1,
                CompanyName = "Tesla",
                Role = "Software Engineer",
                Status = "Interviewing",
                ApplicationDate = new DateTime(2025, 3, 5),
                Location = "Austin, Texas",
                SalaryEstimate = "$125k-130k",
                Notes = "Updated status to interviewing.",
                JobType = "Contract",
                Referral = true,
                RoleDescription = "Develop software for Tesla vehicles",
                InterviewDates = new DateTime[] { new DateTime(2025, 3, 28), new DateTime(2025, 4, 10) },
                LastHeardDate = new DateTime(2025, 4, 2),
                JobLink = ""
            };
            var response = await _client.PutAsJsonAsync("/api/JobApplication/1", updatedApplication);
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var application = JsonSerializer.Deserialize<JobApplication>(
                await response.Content.ReadAsStringAsync(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.NotNull(application);
            Assert.Equal("Interviewing", application.Status);
            Assert.Equal(new DateTime(2025, 3, 5), application.ApplicationDate);
            Assert.Equal("Austin, Texas", application.Location);
            Assert.Equal("$125k-130k", application.SalaryEstimate);
            Assert.Equal("Updated status to interviewing.", application.Notes);
            Assert.Equal("Contract", application.JobType);
            Assert.True(application.Referral);
            Assert.Equal("Develop software for Tesla vehicles", application.RoleDescription);
            Assert.NotNull(application.InterviewDates);
            Assert.Equal(new DateTime(2025, 3, 28), application.InterviewDates[0]);
            Assert.Equal(new DateTime(2025, 4, 10), application.InterviewDates[1]);
            Assert.Equal(new DateTime(2025, 4, 2), application.LastHeardDate);
            Assert.Equal("", application.JobLink);
        }
    }
}