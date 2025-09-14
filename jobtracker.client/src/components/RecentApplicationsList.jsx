function RecentApplicationsList({ recentJobs, setSelectedJob, formatDate, getStatusBadge, setActiveView}) {
    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">Recent Applications</h5>
                    </div>
                    <div className="card-body pt-0 pb-0">
                        {recentJobs.map(app => (
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

                        <div className="text-center mt-3 pb-3">
                            <button className="btn btn-outline-primary" onClick={() => setActiveView('applications')}>
                                View All Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
                       
export default RecentApplicationsList;
