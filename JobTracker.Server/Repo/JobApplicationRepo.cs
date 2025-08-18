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

        // Private Method to convert date times to UTC for EF Core
        private void NormalizeDatesToUtc(JobApplication application)
        {
            application.ApplicationDate = DateTime.SpecifyKind(application.ApplicationDate, DateTimeKind.Utc);

            if (application.LastHeardDate.HasValue)
            {
                application.LastHeardDate = DateTime.SpecifyKind(application.LastHeardDate.Value, DateTimeKind.Utc);
            }

            if (application.InterviewDates != null)
            {
                application.InterviewDates = application.InterviewDates
                    .Select(d => DateTime.SpecifyKind(d, DateTimeKind.Utc))
                    .ToArray();
            }
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
                .Where(a => EF.Functions.Like(a.Status, status))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> SearchAsync(string term)
        {
            if (string.IsNullOrWhiteSpace(term))
                return new List<JobApplication>();

            return await _context.JobApplications
                .Where(a => EF.Functions.Like(a.CompanyName, $"%{term}%") ||
                           EF.Functions.Like(a.Role, $"%{term}%"))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetRecentAsync(int limit)
        {
            return await _context.JobApplications
                .OrderByDescending(a => a.ApplicationDate)
                .Take(limit)
                .ToListAsync();
        }

        // TODO: Update to check the DB for most recent ID of job application and increase it by one 
        public async Task<JobApplication> CreateAsync(JobApplication application)
        {
            NormalizeDatesToUtc(application);
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<JobApplication?> UpdateAsync(int id, JobApplication application)
        {
            application.Id = id;
            NormalizeDatesToUtc(application);
            _context.JobApplications.Update(application);

            try
            {
                await _context.SaveChangesAsync();
                return application;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _context.JobApplications.AnyAsync(e => e.Id == id))
                    return null;
                throw;
            }
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