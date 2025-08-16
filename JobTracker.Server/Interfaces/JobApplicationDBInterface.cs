using JobTracker.Server.Models;

namespace JobTracker.Server.Interfaces
{
    public interface JobApplicationDBInterface
    {
        // Read operations
        Task<IEnumerable<JobApplication>> GetAllAsync();
        Task<JobApplication?> GetByIdAsync(int id);
        Task<IEnumerable<JobApplication>> GetByStatusAsync(string status);
        Task<IEnumerable<JobApplication>> SearchAsync(string term);
        Task<IEnumerable<JobApplication>> GetRecentAsync(int limit);
        Task<(int total, int pendingInterviews, int totalInterviews, int offers)> GetStatisticsAsync();

        // Write operations
        Task<JobApplication> CreateAsync(JobApplication application);
        Task<JobApplication?> UpdateAsync(int id, JobApplication application);
        Task<bool> DeleteAsync(int id);
    }
}