import React from 'react';

function DeleteApplication({ isOpen, onClose, onConfirm, application, getStatusBadge }) {
    if (!isOpen || !application) return null;

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/JobApplication/${application.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                console.log('Application deleted successfully');
                onConfirm(application.id);
                onClose();
            } else {
                const errorText = await response.text();
                console.error('Failed to delete application:', errorText);
                alert(`Failed to delete application: ${errorText || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('An error occurred while deleting the application. Please try again.');
        }
    };

    return (
        <>
            {/* Background */}
            <div className={`modal-backdrop fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} onClick={onClose}></div>

            {/* Modal */}
            <div className={`modal fade ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                Confirm Deletion
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                        </div>

                        <div className="modal-body">
                            <p className="mb-3">
                                Are you sure you want to delete this job application?
                            </p>
                            <div className="border rounded p-3 bg-light">
                                <div className="mb-2">
                                    <strong>Company:</strong> {application.companyName}
                                </div>
                                <div className="mb-2">
                                    <strong>Role:</strong> {application.role}
                                </div>
                                <div>
                                    <strong>Status:</strong>
                                    <span className={`badge ${getStatusBadge(application.status)}`}>
                                        {application.status}
                                    </span>
                                </div>
                            </div>

                            <div className="alert alert-warning mt-3 mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                This action cannot be undone. All associated data will be permanently removed.
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                <i className="bi bi-trash me-2"></i>
                                Delete Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteApplication;