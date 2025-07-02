import React, { useState, useEffect } from 'react';
import StatsCard from './components/StatsCard';

function JobApplicationsList() {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/JobApplication');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setJobApplications(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching job applications:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobApplications();
    }, []);

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

    const getStats = () => {
        const total = jobApplications.length;
        const applied = jobApplications.filter(job => job.status === 'Applied').length;
        const interviews = jobApplications.filter(job => job.status === 'Interviewing').length;
        const offers = jobApplications.filter(job => job.status === 'Offer').length;
        return { total, applied, interviews, offers };
    };

    const stats = getStats();

    /* Creates the navigation menu to change to different parts of application
    * On click has a special parameter to prevent it from changing the URL otherwise it changes to the correct view
    */
    const renderNavigation = () => (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="/" onClick={(e) => { e.preventDefault(),setActiveView('dashboard') }}>
                    <div className="bi bi-briefcase me-2"></div>Job Tracker
                </a>
                <div className="navbar-nav">
                    <a className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`} href="/" onClick={(e) => { e.preventDefault(), setActiveView('dashboard') }}>
                        Dashboard
                    </a>
                    <a className={`nav-link ${activeView === 'applications' ? 'active' : ''}`} href="/" onClick={(e) => { e.preventDefault(), setActiveView('applications') }}>
                        Applications
                    </a>
                </div>
            </div>
        </nav>
    );

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
                <StatsCard title="Total Applications" value={stats.total} icon="📊" bgColor="bg-primary" textColor="text-white"/>
                <StatsCard title="Pending Response" value={stats.applied} icon="⏰" bgColor="bg-warning" textColor="text-black" />
                <StatsCard title="Interviews" value={stats.interviews} icon="📅" bgColor="bg-info" textColor="text-white" />
                <StatsCard title="Offers" value={stats.offers} icon="🏆" bgColor="bg-success" textColor="text-white" />
            </div>

            {/* Recent Applications */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">Recent Applications</h5>
                        </div>
                        <div className="card-body">
                            {/* Sort the date to show most recent applications first, then map and show */}
                            {jobApplications.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)).slice(0, 5).map(app => (
                                <div key={app.id} className="d-flex justify-content-between align-items-center border-bottom py-3 cursor-pointer"
                                    onClick={() => setSelectedJob(app)}
                                    style={{ cursor: 'pointer' }}>
                                    <div>
                                        <strong>{app.companyName}</strong> - {app.role}
                                        <br />
                                        <small className="text-muted">Applied: {formatDate(app.applicationDate)}</small>
                                    </div>
                                    <span className={`badge ${getStatusBadge(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                            {jobApplications.length > 5 && (
                                <div className="text-center mt-3">
                                    <button className="btn btn-outline-primary" onClick={() => setActiveView('applications')}>
                                        View All Applications
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJobDetail = () => (
        <div className="container-fluid">
            <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => setSelectedJob(null)}
            >
                ← Back to {activeView === 'dashboard' ? 'Dashboard' : 'Applications'}
            </button>

            <div className="row">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary-subtle">
                            <h3 className="mb-0">{selectedJob.role}</h3>
                            <h5 className="text-muted mb-0">{selectedJob.companyName}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Status:</strong>
                                    <span className={`badge ms-2 ${getStatusBadge(selectedJob.status)}`}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                                <div className="col-md-6">
                                    <strong>Job Type:</strong> {selectedJob.jobType || 'N/A'}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Location:</strong> {selectedJob.location || 'N/A'}
                                </div>
                                <div className="col-md-6">
                                    <strong>Salary:</strong> {selectedJob.salaryEstimate || 'N/A'}
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <strong>Applied Date:</strong> {formatDate(selectedJob.applicationDate)}
                                </div>
                                <div className="col-md-6">
                                    <strong>Last Contact:</strong> {formatDate(selectedJob.lastHeardDate)}
                                </div>
                            </div>

                            {selectedJob.referral && (
                                <div className="alert alert-info">
                                    <strong>📞 Applied through referral</strong>
                                </div>
                            )}

                            {selectedJob.roleDescription && (
                                <div className="mb-3">
                                    <h6>Role Description:</h6>
                                    <p className="text-muted">{selectedJob.roleDescription}</p>
                                </div>
                            )}

                            {selectedJob.notes && (
                                <div className="mb-3">
                                    <h6>Notes:</h6>
                                    <div className="alert alert-light">
                                        {selectedJob.notes}
                                    </div>
                                </div>
                            )}

                            {selectedJob.jobLink && (
                                <div className="mb-3">
                                    <a href={selectedJob.jobLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary">
                                        🔗 View Job Posting
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">Interview Timeline</h6>
                        </div>
                        <div className="card-body">
                            {selectedJob.interviewDates && selectedJob.interviewDates.length > 0 ? (
                                <div className="timeline">
                                    {selectedJob.interviewDates.map((date, index) => (
                                        <div key={index} className="d-flex align-items-center mb-2">
                                            <span className="badge bg-primary me-2">{index + 1}</span>
                                            <span>Interview: {formatDate(date)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No interviews scheduled</p>
                            )}
                        </div>
                    </div>

                    <div className="card mt-3">
                        <div className="card-header">
                            <h6 className="mb-0">Application Details</h6>
                        </div>
                        <div className="card-body">
                            <div className="mb-2">
                                <small className="text-muted">Application ID:</small><br />
                                <span>#{selectedJob.id}</span>
                            </div>
                            <div className="mb-2">
                                <small className="text-muted">Days Since Applied:</small><br />
                                <span>{Math.floor((new Date() - new Date(selectedJob.applicationDate)) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                            {selectedJob.lastHeardDate && (
                                <div className="mb-2">
                                    <small className="text-muted">Days Since Last Contact:</small><br />
                                    <span>{Math.floor((new Date() - new Date(selectedJob.lastHeardDate)) / (1000 * 60 * 60 * 24))} days</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderApplications = () => (
        <div className="container-fluid">
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Job Applications</h2>
                </div>
                <div className="col-md-6">
                    <div className="d-flex gap-2">
                        <input type="text" className="form-control" placeholder="Search companies or roles..."
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
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

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>Company</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Applied Date</th>
                                    <th>Location</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map(app => (
                                    <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedJob(app)}>
                                        <td>
                                            <div>
                                                <strong>{app.companyName}</strong>
                                                {app.referral && <span className="badge bg-info ms-2">Referral</span>}
                                            </div>
                                        </td>
                                        <td>{app.role}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(app.applicationDate)}</td>
                                        <td>{app.location || 'N/A'}</td>
                                        <td>{app.salaryEstimate || 'N/A'}</td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedJob(app);
                                                }}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredJobs.length === 0 && (
                            <div className="text-center py-4">
                                <p className="text-muted">No applications found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

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

    if (jobApplications.length === 0) return (
        <div className="text-center py-5">
            <h3>No job applications found</h3>
            <p className="text-muted">Start tracking your job applications to see them here.</p>
        </div>
    );

    return (
        <div className="min-vh-100 bg-light">
            {renderNavigation()}
            {selectedJob ? renderJobDetail() : (
                activeView === 'dashboard' ? renderDashboard() : renderApplications()
            )}
        </div>
    );
}

export default JobApplicationsList;