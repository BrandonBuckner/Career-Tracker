namespace JobTracker.Server.Models
{
    public class JobApplication
    {
        public int Id { get; init; }
        public string CompanyName { get; init; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RoleDescription { get; set; }
        public DateTime ApplicationDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? LastHeardDate { get; set; }
        public DateTime[]? InterviewDates { get; set; }
        public string? JobType { get; set; }
        public string? Location { get; set; }
        public string? SalaryEstimate { get; set; }
        public string? JobLink { get; set; }
        public bool? Referral { get; set; }
        public string? Notes { get; set; }

        public JobApplication(int id, string companyName, string role, string status, DateTime applicationDate)
        {
            Id = id;
            CompanyName = companyName ?? throw new ArgumentNullException(nameof(companyName));
            Role = role ?? throw new ArgumentNullException(nameof(role));
            Status = status ?? throw new ArgumentNullException(nameof(status));
            ApplicationDate = applicationDate != default ? applicationDate : throw new ArgumentNullException("Application date cannot be default value.", nameof(ApplicationDate));
        }
    }
}                                                                                       
