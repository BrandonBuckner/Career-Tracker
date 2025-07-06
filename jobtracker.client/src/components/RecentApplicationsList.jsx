function RecentApplicationsList({ jobApplications, setSelectedJob, formatDate, getStatusBadge, setActiveView}) {
    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Recent Applications</h5>
                    </div>
                    <div className="card-body mt-0 pt-0">
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
    );
}

export default RecentApplicationsList;
