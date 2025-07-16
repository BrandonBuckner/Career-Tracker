import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import JobDetail from './components/JobDetail';
import Dashboard from './components/Dashboard';
import ApplicationsPage from './components/ApplicationsPage';

function JobTracker() {
    // Designed like this to minimize the number of API calls made to the server 
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [recentJobs, setRecentJobs] = useState([]);
    const [statsData, setStatsData] = useState({});
    const [dashboardLoaded, setDashboardLoaded] = useState(false);
    const [applicationsLoaded, setApplicationsLoaded] = useState(false);

    // This method decides when to fetch new data 
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
            // Convert responses to JSON
            const recentData = await recentResponse.json();
            const statsDataResponse = await statsResponse.json();
            // Sets Data 
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

    // Formats date to ensure it uses Date object or returns 'N/A' if no date is provided
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Status map to determine the badge color based on job status
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

    // Decides what to render on the UI side
    // TODO: BUG allows user to navigate to a different application page while still having job details pulled up 
    return (
        <div className="min-vh-100 bg-light">
            <Navigation activeView={activeView} onViewChange={setActiveView} />
            {selectedJob ?
                <JobDetail
                    activeView={activeView}
                    selectedJob={selectedJob}
                    setSelectedJob={setSelectedJob}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                    onJobUpdate={fetchAllApplications} 
                />
                : (activeView === 'dashboard' ?
                    <Dashboard statsData={statsData} recentJobs={recentJobs} setSelectedJob={setSelectedJob} setActiveView={setActiveView} formatDate={formatDate} getStatusBadge={getStatusBadge} />
                    : <ApplicationsPage jobApplications={jobApplications} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate}/>
                )
            }
        </div>
    );
}

export default JobTracker;