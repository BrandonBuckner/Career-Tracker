function ApplicationTable({ filteredJobs, setSelectedJob, getStatusBadge, formatDate }) {
    return (
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
                                        <button className="btn btn-outline-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedJob(app); }}>
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
    )
}

export default ApplicationTable;
