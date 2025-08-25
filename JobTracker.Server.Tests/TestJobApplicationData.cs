using JobTracker.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobTracker.Server.Tests
{
    public static class TestJobApplicationData
    {
        public static List<JobApplication> GetTestApplications()
        {
            return new List<JobApplication>
            {
                new JobApplication(1, "Tesla", "Software Engineer", "Withdrawn", new DateTime(2025, 3, 2))
            {
                Location = "Austin, TX",
                SalaryEstimate = "$120k-150k",
                Notes = "Withdrew application after learning about mandatory relocation. Not ready to move to Texas.",
                JobType = "Full-time",
                Referral = false,
                RoleDescription = "Develop software for Tesla's autopilot and vehicle control systems using C++ and Python",
                InterviewDates = new DateTime[] { new DateTime(2025, 4, 1) },
                LastHeardDate = new DateTime(2025, 4, 1),
                JobLink = "https://tesla.com/careers/software-engineer-autopilot"
            },
            new JobApplication(2, "Airbnb", "Frontend Engineer", "Interviewing", DateTime.Now.AddDays(-7))
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
            new JobApplication(3, "Shopify", "Backend Developer", "Applied", DateTime.Now.AddDays(-14))
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
            new JobApplication(4, "Discord", "Platform Engineer", "Rejected", DateTime.Now.AddDays(-18))
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
            new JobApplication(5, "Stripe", "API Developer", "Offered", DateTime.Now.AddDays(-22))
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
            },
            new JobApplication(6, "Shopers+", "Backend Developer", "Applied", DateTime.Now.AddDays(-14))
            {
                Location = "Oklahoma City, OK",
                SalaryEstimate = "$110-120k",
                Notes = "Applied through online options.",
                JobType = "Contract",
                Referral = true,
                RoleDescription = "Build scalable e-commerce APIs",
                InterviewDates = null,
                LastHeardDate = DateTime.Now.AddDays(-10),
                JobLink = ""
            }
            };
        }
    }
}
