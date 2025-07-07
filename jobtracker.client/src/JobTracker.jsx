import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import StatsCard from './components/StatsCard';
import RecentApplicationsList from './components/RecentApplicationsList';
import JobDetail from './components/JobDetail';
import ApplicationTable from './components/ApplicationTable';

function JobTracker() {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [recentJobs, setRecentJobs] = useState([]);
    const [statsData, setStatsData] = useState({});
    const [dashboardLoaded, setDashboardLoaded] = useState(false);
    const [applicationsLoaded, setApplicationsLoaded] = useState(false);

    useEffect(() => {
        if (activeView === 'dashboard' && !dashboardLoaded) {
            fetchDashboardData();
        } else if (activeView === 'applications' && !applicationsLoaded) {
            fetchAllApplications();
        }
    }, [activeView, dashboardLoaded, applicationsLoaded]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch both recent jobs and stats
            const [recentResponse, statsResponse] = await Promise.all([
                fetch('/api/JobApplication/recent?limit=5'),
                fetch('/api/JobApplication/stats'),
            ]);

            if (!recentResponse.ok || !statsResponse.ok) {
                throw new Error('Failed to fetch dashboard data');
            }

            const recentData = await recentResponse.json();
            const statsDataResponse = await statsResponse.json();

            setRecentJobs(recentData);
            setStatsData(statsDataResponse);
            setDashboardLoaded(true);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/JobApplication');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setJobApplications(data);
            setApplicationsLoaded(true);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching job applications:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Applied': 'bg-primary',
            'Interviewing': 'bg-warning text-dark',
            'Offer': 'bg-success',
            'Rejected': 'bg-danger',
            'Withdrawn': 'bg-secondary'
        };
        return statusMap[status] || 'bg-secondary';
    };

    /* Filters jobs based on their status and or what was typed in the search box*/
    const filteredJobs = jobApplications.filter(job => {
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        const matchesSearch = job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    /* Create and Display the main page dashboard */
    const renderDashboard = () => (
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

    function renderApplications() {
        return (
            <div>
                <div className="container-fluid">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <h2>Job Applications</h2>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex gap-2">
                                <input type="text" className="form-control" placeholder="Search companies or roles..."
                                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="all">All Status</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Offer">Offer</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <ApplicationTable filteredJobs={filteredJobs} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate} />
            </div>
        );
    }

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p>{error}</p>
        </div>
    );

    // Check if there are no recent jobs to display. If so, show a message stating nothing was found
    if (activeView === 'dashboard' && recentJobs.length === 0 && dashboardLoaded) {
        return (
            <div className="text-center py-5">
                <h3>No job applications found</h3>
                <p className="text-muted">Start tracking your job applications to see them here.</p>
            </div>
        );
    } 

    return (
        <div className="min-vh-100 bg-light">
            <Navigation activeView={activeView} onViewChange={setActiveView} />
            {selectedJob ? <JobDetail activeView={activeView} selectedJob={selectedJob} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate} />
                : (activeView === 'dashboard' ? renderDashboard() : renderApplications())
            }
        </div>
    );
}

export default JobTracker;