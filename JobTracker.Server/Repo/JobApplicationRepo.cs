using Microsoft.EntityFrameworkCore;
using JobTracker.Server.Data;
using JobTracker.Server.Interfaces;
using JobTracker.Server.Models;

namespace JobTracker.Server.Repo
{
    public class JobApplicationRepo : JobApplicationDBInterface
    {
        private readonly JobApplicationDBContext _context;

        public JobApplicationRepo(JobApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobApplication>> GetAllAsync()
        {
            return await _context.JobApplications
                .OrderByDescending(a => a.ApplicationDate)
                .ThenBy(a => a.CompanyName)
                .ToListAsync();
        }

        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<JobApplication>> GetByStatusAsync(string status)
        {
            return await _context.JobApplications
                .Where(a => EF.Functions.ILike(a.Status, status))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> SearchAsync(string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return new List<JobApplication>();

            return await _context.JobApplications
                .Where(a => EF.Functions.ILike(a.CompanyName, $"%{term}%") ||
                           EF.Functions.ILike(a.Role, $"%{term}%"))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetRecentAsync(int limit)
        {
            return await _context.JobApplications
                .OrderByDescending(a => a.ApplicationDate)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<JobApplication> CreateAsync(JobApplication application)
        {
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<JobApplication?> UpdateAsync(int id, JobApplication application)
        {
            var existing = await GetByIdAsync(id);
            if (existing == null)
                return null;

            existing.CompanyName = application.CompanyName;
            existing.Role = application.Role;
            existing.Status = application.Status;
            existing.ApplicationDate = application.ApplicationDate;
            existing.Location = application.Location;
            existing.SalaryEstimate = application.SalaryEstimate;
            existing.Notes = application.Notes;
            existing.JobType = application.JobType;
            existing.Referral = application.Referral;
            existing.RoleDescription = application.RoleDescription;
            existing.InterviewDates = application.InterviewDates;
            existing.LastHeardDate = application.LastHeardDate;
            existing.JobLink = application.JobLink;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var application = await GetByIdAsync(id);
            if (application == null)
                return false;

            _context.JobApplications.Remove(application);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<(int total, int pendingInterviews, int totalInterviews, int offers)> GetStatisticsAsync()
        {
            var applications = await _context.JobApplications.ToListAsync();

            var total = applications.Count;
            var pendingInterviews = applications.Count(a => a.Status == "Interviewing");
            var totalInterviews = applications
                .Sum(a => a.InterviewDates?.Length ?? 0);
            var offers = applications.Count(a => a.Status == "Offered");

            return (total, pendingInterviews, totalInterviews, offers);
        }
    }
}