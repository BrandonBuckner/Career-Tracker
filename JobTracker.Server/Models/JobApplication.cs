namespace JobTracker.Server.Models
{
    public class JobApplication
    {
        //TODO: Define properties
        private int id;
        private string companyName;
        private string role;
        private string roleDescription;
        private DateTime applicationDate;
        private string status;
        private DateTime lastHeardDate;
        private DateTime[] interviewDates;
        private string jobType;
        private string location;
        private string salaryEstimate; //Do I do a salary range and an hourly estimate? 
        private string jobLink;
        private bool refferal; 
        private string notes;

        public int Id { get => id; init => id = value; }
        public string CompanyName { get => companyName; init => companyName = value; }
        public string Role { get => role; init => role = value; }
    }
}                                                                                       
