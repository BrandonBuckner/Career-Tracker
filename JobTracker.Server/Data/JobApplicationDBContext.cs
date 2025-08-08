using Microsoft.EntityFrameworkCore;
using JobTracker.Server.Models;

namespace JobTracker.Server.Data
{
    public class JobApplicationDBContext : DbContext
    {
        public DbSet<JobApplication> JobApplications { get; set; }

        public JobApplicationDBContext(DbContextOptions<JobApplicationDBContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.CompanyName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Location)
                    .HasMaxLength(100);

                entity.Property(e => e.SalaryEstimate)
                    .HasMaxLength(50);

                entity.Property(e => e.Notes)
                    .HasMaxLength(1000);

                entity.Property(e => e.RoleDescription)
                    .HasMaxLength(2000);

                entity.Property(e => e.JobLink)
                    .HasMaxLength(500);

                entity.Property(e => e.JobType)
                    .HasMaxLength(50);

                entity.Property(e => e.InterviewDates)
                    .HasColumnType("timestamp[]");

                // This is likely a commond indexed spot which can improve performance 
                // TODO: Comeback to this and verify it does speed up the query performance/is worth it 
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.ApplicationDate);
                entity.HasIndex(e => e.CompanyName);
            });
        }
    }
}