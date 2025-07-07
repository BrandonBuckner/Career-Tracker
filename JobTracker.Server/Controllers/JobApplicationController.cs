using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using JobTracker.Server.Models;
using System.Diagnostics.Eventing.Reader;

namespace JobTracker.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<JobApplication>> GetAllApplications()
        {
            var sortedApplications = staticJobApplications
                .OrderByDescending(app => app.ApplicationDate)
                .ThenBy(app => app.CompanyName)
                .ToList();

            return Ok(sortedApplications);
        }

        [HttpGet("{id}")]
        public ActionResult<JobApplication> GetApplicationById(int id)
        {
            var application = staticJobApplications.FirstOrDefault(app => app.Id == id);
            if (application == null)
            {
                return NotFound();
            }
            return Ok(application);
        }

        [HttpGet("stats")]
        public ActionResult<object> GetStats()
        {
            var totalApplications = staticJobApplications.Count;
            var pendingInterviews = staticJobApplications.Count(app => app.Status == "Interviewing");
            var totalInterviews = staticJobApplications.Sum(app => app.InterviewDates != null ? app.InterviewDates.Length : 0);
            var offered = staticJobApplications.Count(app => app.Status == "Offered");

            return (Ok(new
            {
                TotalApplications = totalApplications,
                PendingInterviews = pendingInterviews,
                TotalInterviews = totalInterviews,
                TotalOffers = offered
            }));

        }

        [HttpGet("by-status/{status}")]
        public ActionResult<IEnumerable<JobApplication>> GetApplicationsByStatus(string status)
        {
            var applications = staticJobApplications.Where(app => app.Status.Equals(status, StringComparison.OrdinalIgnoreCase)).ToList();
            if (!applications.Any())
            {
                return NotFound();
            }
            return Ok(applications);
        }

        [HttpGet("search")]
        public ActionResult<IEnumerable<JobApplication>> SearchApplications([FromQuery] string term)
        {
            if(term == null)
            {
                return BadRequest("Search term cannot be null.");
            }
            var applications = staticJobApplications
                .Where(app => app.CompanyName.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                              app.Role.Contains(term, StringComparison.OrdinalIgnoreCase))
                .ToList();
            return Ok(applications);
        }

        [HttpGet("recent")]
        public ActionResult<IEnumerable<JobApplication>> GetRecentApplications([FromQuery] int limit = 5)
        {
            if(limit <= 0) { 
                return BadRequest("Limit must be a positive integer.");
            }
            if(limit > 20) {
                return BadRequest("Limit cannot exceed 20.");
            }

            var recentApplications = staticJobApplications
                .OrderByDescending(app => app.ApplicationDate)
                .Take(limit)
                .ToList();
            return Ok(recentApplications);
        }

        //TODO: Update this to be a database instead of static data 
        private static readonly List<JobApplication> staticJobApplications = new List<JobApplication>
        {
            new JobApplication(1, "Microsoft", "Software Engineer", "Applied", DateTime.Now.AddDays(-5))
            {
                Location = "Seattle, WA",
                SalaryEstimate = "$120k-150k",
                Notes = "Applied through LinkedIn",
            },
            new JobApplication(2, "Google", "Frontend Developer", "Interviewing", DateTime.Now.AddDays(-3))
            {
                Location = "Mountain View, CA",
                SalaryEstimate = "$130k-160k",
                InterviewDates = new DateTime[] { DateTime.Now.AddDays(2) },
            },
            new JobApplication(3, "Meta", "React Developer", "Interviewing", DateTime.Now.AddDays(-12))
            {
                Location = "Menlo Park, CA",
                SalaryEstimate = "$145k-175k",
                Notes = "Two technical rounds completed. Waiting for final decision. Team seemed very collaborative.",
                JobType = "Full-time",
                Referral = false,
                RoleDescription = "Build user-facing features for Facebook and Instagram using React, GraphQL, and modern web technologies",
                InterviewDates = new DateTime[] {
                    DateTime.Now.AddDays(-8),
                    DateTime.Now.AddDays(-5)
                },
                LastHeardDate = DateTime.Now.AddDays(-3),
                JobLink = "https://careers.meta.com/jobs/react-developer-2024"
            },

            new JobApplication(4, "Spotify", "Full Stack Engineer", "Applied", DateTime.Now.AddDays(-2))
            {
                Location = "Remote",
                SalaryEstimate = "$110k-140k",
                Notes = "Applied through their careers page. Very interested in music streaming technology.",
                JobType = "Full-time",
                Referral = true,
                RoleDescription = "Work on music recommendation algorithms and user experience features using Python, React, and machine learning",
                InterviewDates = null,
                LastHeardDate = null,
                JobLink = "https://lifeatspotify.com/jobs/full-stack-engineer"
            },

            new JobApplication(5, "Tesla", "Software Engineer", "Withdrawn", DateTime.Now.AddDays(-25))
            {
                Location = "Austin, TX",
                SalaryEstimate = "$120k-150k",
                Notes = "Withdrew application after learning about mandatory relocation. Not ready to move to Texas.",
                JobType = "Full-time",
                Referral = false,
                RoleDescription = "Develop software for Tesla's autopilot and vehicle control systems using C++ and Python",
                InterviewDates = new DateTime[] { DateTime.Now.AddDays(-20) },
                LastHeardDate = DateTime.Now.AddDays(-18),
                JobLink = "https://tesla.com/careers/software-engineer-autopilot"
            },
            new JobApplication(6, "Airbnb", "Frontend Engineer", "Interviewing", DateTime.Now.AddDays(-7))
            {
                Location = "San Francisco, CA",
                SalaryEstimate = "$135k-165k",
                Notes = "Recruiter reached out on LinkedIn. Interview scheduled for next week. Need to prepare system design questions.",
                JobType = "Full-time",
                Referral = false,
                RoleDescription = "Build and maintain host and guest-facing web applications using React, TypeScript, and modern CSS frameworks",
                InterviewDates = new DateTime[] {
                    DateTime.Now.AddDays(3),
                    DateTime.Now.AddDays(7)
                },
                LastHeardDate = DateTime.Now.AddDays(-2),
                JobLink = "https://careers.airbnb.com/positions/frontend-engineer-2024"
            },
            new JobApplication(7, "Shopify", "Backend Developer", "Applied", DateTime.Now.AddDays(-14))
            {
                Location = "Toronto, ON",
                SalaryEstimate = "$95k-120k CAD",
                Notes = "Canadian company, so salary is in CAD. Applied through university career fair connection.",
                JobType = "Contract",
                Referral = true,
                RoleDescription = "Build scalable e-commerce APIs and microservices using Ruby on Rails, GraphQL, and cloud technologies",
                InterviewDates = null,
                LastHeardDate = DateTime.Now.AddDays(-10),
                JobLink = "https://shopify.com/careers/backend-developer-ruby"
            }, 
            new JobApplication(8, "Discord", "Platform Engineer", "Rejected", DateTime.Now.AddDays(-18))
            {
                Location = "San Francisco, CA",
                SalaryEstimate = "$140k-170k",
                Notes = "Made it through 3 rounds of interviews but didn't get selected. Feedback was positive but they chose someone with more distributed systems experience. Will apply again in 6 months.",
                JobType = "Full-time",
                Referral = false,
                RoleDescription = "Build and scale Discord's real-time messaging infrastructure serving millions of concurrent users using Go, Redis, and Kubernetes",
                InterviewDates = new DateTime[] {
                    DateTime.Now.AddDays(-15),
                    DateTime.Now.AddDays(-12),
                    DateTime.Now.AddDays(-9)
                },
                LastHeardDate = DateTime.Now.AddDays(-5),
                JobLink = "https://discord.com/jobs/platform-engineer-infrastructure"
            },
            new JobApplication(9, "Stripe", "API Developer", "Offer", DateTime.Now.AddDays(-22))
            {
                Location = "Remote (US)",
                SalaryEstimate = "$155k-185k",
                Notes = "Received offer! Need to respond by end of week. Great compensation package includes equity and signing bonus. Team culture seems excellent.",
                JobType = "Full-time",
                Referral = true,
                RoleDescription = "Design and implement payment APIs and financial infrastructure tools used by millions of businesses worldwide using Ruby, TypeScript, and PostgreSQL",
                InterviewDates = new DateTime[] {
                    DateTime.Now.AddDays(-16),
                    DateTime.Now.AddDays(-13),
                    DateTime.Now.AddDays(-10),
                    DateTime.Now.AddDays(-8)
                },
                LastHeardDate = DateTime.Now.AddDays(-1),
                JobLink = "https://stripe.com/jobs/api-developer-platform"
            }
        };
    }
}
