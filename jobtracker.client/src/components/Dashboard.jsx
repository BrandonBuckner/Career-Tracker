import StatsCard from './StatsCard';
import RecentApplicationsList from './RecentApplicationsList';

function Dashboard({ statsData, recentJobs, setSelectedJob, setActiveView, formatDate, getStatusBadge }) {
    return (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="mb-4">Dashboard Overview</h2>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <StatsCard title="Total Applications" value={statsData.totalApplications || 0} icon="📊" bgColor="bg-primary" textColor="text-white" />
                <StatsCard title="Pending Interview" value={statsData.pendingInterviews || 0} icon="⏰" bgColor="bg-warning" textColor="text-black" />
                <StatsCard title="Total Interviews" value={statsData.totalInterviews || 0} icon="📅" bgColor="bg-info" textColor="text-white" />
                <StatsCard title="Offers" value={statsData.totalOffers || 0} icon="🏆" bgColor="bg-success" textColor="text-white" />
            </div>

            {/* Recent Applications List */}
            <RecentApplicationsList recentJobs={recentJobs} setSelectedJob={setSelectedJob} formatDate={formatDate} getStatusBadge={getStatusBadge} setActiveView={setActiveView} />
        </div>
  );
}

export default Dashboard;