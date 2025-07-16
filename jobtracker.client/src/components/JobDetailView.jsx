function JobDetailView({ selectedJob, getStatusBadge, formatDate }) {
    return (
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
    );
}

export default JobDetailView;