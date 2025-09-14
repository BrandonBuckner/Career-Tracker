# Career Tracker

Career Tracker is an application to **track job applications and career goals**.  
It’s designed as a personal dashboard for managing your career search, and it currently supports full CRUD operations for job applications via a local PostgreSQL database.

> Future enhancements may include: resume-building tips, certification tracking, applying to future positions, and overall progress analytics.

---

## 🛠 Tech Stack

- **Frontend:** Vite + React  
- **Backend:** C# with ASP.NET Core  
- **Database:** PostgreSQL with Entity Framework Core  
- **Architecture:** MVC pattern  
- **Testing:** Integration tests for API endpoints (xUnit)

---

## ✨ Features (current)

- Add, view, edit, and delete job applications  
- Store data persistently in PostgreSQL  
- RESTful API built with ASP.NET Core  
- Integration tests verify API endpoints and business logic  

---

## 🗄 Data Model

Current entity: `JobApplication`

| Field | Type | Notes |
|-------|------|-------|
| Id | int | Primary key |
| CompanyName | string | Company you applied to |
| Role | string | Position title |
| RoleDescription | string? | Optional |
| ApplicationDate | DateTime | When you applied |
| Status | string | e.g., Applied, Interviewing, Offer |
| LastHeardDate | DateTime? | Last update |
| InterviewDates | DateTime[]? | Multiple interviews |
| JobType | string? | Full-time, Contract, etc. |
| Location | string? | Office/remote |
| SalaryEstimate | string? | Optional |
| JobLink | string? | Link to posting |
| Referral | bool? | Referral used |
| Notes | string? | Extra info |

---

## 🚀 Getting Started

### Prerequisites
- [.NET SDK 8+](https://dotnet.microsoft.com/en-us/download)
- [Node.js & npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Setup
# 1. Clone the repo
git clone https://github.com/BrandonBuckner/Career-Tracker.git

# 2. Create database
createdb -U postgres jobtracker

# 3. Backend
cd JobTracker.Server
dotnet restore
dotnet ef database update
dotnet run

# 4. Frontend (new terminal)
cd ../jobtracker.client
npm install
npm run dev
