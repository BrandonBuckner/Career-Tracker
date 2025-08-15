using Microsoft.AspNetCore.Mvc;
using JobTracker.Server.Models;
using JobTracker.Server.Interfaces;

namespace JobTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        private readonly JobApplicationDBInterface _repository;

        // Constructor - ASP.NET will inject the repository
        public JobApplicationController(JobApplicationDBInterface repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobApplication>>> GetAllApplications()
        {
            var applications = await _repository.GetAllAsync();
            return Ok(applications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobApplication>> GetApplicationById(int id)
        {
            var application = await _repository.GetByIdAsync(id);
            if (application == null)
                return NotFound();

            return Ok(application);
        }

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var stats = await _repository.GetStatisticsAsync();
            return Ok(new
            {
                TotalApplications = stats.total,
                PendingInterviews = stats.pendingInterviews,
                TotalInterviews = stats.totalInterviews,
                TotalOffers = stats.offers
            });
        }

        [HttpGet("by-status/{status}")]
        public async Task<ActionResult<IEnumerable<JobApplication>>> GetApplicationsByStatus(string status)
        {
            var applications = await _repository.GetByStatusAsync(status);
            if (!applications.Any())
                return NotFound();

            return Ok(applications);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<JobApplication>>> SearchApplications([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return BadRequest("Search term cannot be null or empty.");

            var applications = await _repository.SearchAsync(term);
            return Ok(applications);
        }

        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<JobApplication>>> GetRecentApplications([FromQuery] int limit = 5)
        {
            if (limit <= 0)
            {
                return BadRequest("Limit must be a positive integer.");
            }
            if (limit > 20)
            {
                return BadRequest("Limit cannot exceed 20.");
            }

            var recentApplications = await _repository.GetRecentAsync(limit);
            return Ok(recentApplications);
        }

        [HttpPost]
        public async Task<ActionResult<JobApplication>> CreateApplication([FromBody] JobApplication application)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(application.CompanyName))
                return BadRequest("Company name is required.");
            if (string.IsNullOrWhiteSpace(application.Role))
                return BadRequest("Role is required.");
            if (string.IsNullOrWhiteSpace(application.Status))
                return BadRequest("Status is required.");
            if (application.ApplicationDate > DateTime.Now)
                return BadRequest("Application date cannot be in the future.");

            var created = await _repository.CreateAsync(application);
            return CreatedAtAction(nameof(GetApplicationById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<JobApplication>> UpdateApplication(int id, [FromBody] JobApplication updatedApplication)
        {
            if (updatedApplication == null)
                return BadRequest("Updated application cannot be null.");
            if (id != updatedApplication.Id)
                return BadRequest("ID in URL does not match ID in body.");
            if (updatedApplication.ApplicationDate > DateTime.Now)
                return BadRequest("Application date cannot be in the future.");
            if (updatedApplication.LastHeardDate > DateTime.Now)
                return BadRequest("Last heard date cannot be in the future.");
            if (updatedApplication.LastHeardDate < updatedApplication.ApplicationDate)
                return BadRequest("Last heard date cannot be before application date.");

            var result = await _repository.UpdateAsync(id, updatedApplication);
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteApplication(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

    }
}