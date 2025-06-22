using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using JobTracker.Server.Models;

namespace JobTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        //TODO: Create job application controller (1st get a GET endpoint for test data)
        private static readonly List<JobApplication> staticJobApplications = new List<JobApplication>
        {
            new JobApplication(1, "Microsoft", "Software Engineer", "Applied", DateTime.Now.AddDays(-5))
            {
                Location = "Seattle, WA",
                SalaryEstimate = "$120k-150k",
                Notes = "Applied through LinkedIn"
            },
            new JobApplication(2, "Google", "Frontend Developer", "Interview Scheduled", DateTime.Now.AddDays(-3))
            {
                Location = "Mountain View, CA",
                SalaryEstimate = "$130k-160k",
                InterviewDates = new DateTime[] { DateTime.Now.AddDays(2) }
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<JobApplication>> GetAllApplications()
        {
            return Ok(staticJobApplications);
        }
    }
}
