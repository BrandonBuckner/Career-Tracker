import React, { useState } from 'react';
import DeleteApplication from './DeleteApplication';

function ApplicationTable({ filteredJobs, setSelectedJob, getStatusBadge, formatDate, onDeleteApplication }) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState(null);

    const handleDeleteClick = (app) => {
        setApplicationToDelete(app);  // Store which application we're deleting
        setIsDeleteOpen(true);        // Open the modal
    };

    const handleDeleteConfirm = (applicationId) => {
        onDeleteApplication(applicationId);
    };

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
                                        <button className="btn btn-outline-primary btn-sm mx-2" onClick={(e) => {e.stopPropagation();setSelectedJob(app);}}>
                                            View
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={(e) => {e.stopPropagation(); handleDeleteClick(app);}}>
                                            Delete
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

            <DeleteApplication isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setApplicationToDelete(null); }}
                onConfirm={handleDeleteConfirm} application={applicationToDelete} getStatusBadge={getStatusBadge}   // Pass the specific application to delete
            />
        </div>
    );
}

export default ApplicationTable;