import { useState } from 'react';
import JobDetailView from './JobDetailView';
import JobDetailEdit from './JobDetailEdit';
import DeleteApplication from './DeleteApplication';

function JobDetail({ activeView, selectedJob, setSelectedJob, getStatusBadge, formatDate, onJobUpdate, onDeleteApplication }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Start editing mode
    const startEdit = () => {
        setIsEditing(true);
    };

    // Cancel editing
    const cancelEdit = () => {
        setIsEditing(false);
    };

    // Exit editing after saving 
    const handleSave = async (updatedData) => {
        if (onJobUpdate) {
            onJobUpdate(updatedData);
        }
        setIsEditing(false);
    };


    return (
        <div className="container-fluid">
            {/* Header with navigation and edit controls */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedJob(null)}
                >
                    ← Back to {activeView === 'dashboard' ? 'Dashboard' : 'Applications'}
                </button>

                <div className="d-flex gap-2">
                    {!isEditing ? (
                        <button className="btn btn-primary" onClick={startEdit}>
                            <i className="bi bi-pencil me-2"></i>
                            Edit
                        </button>
                    ) : (
                        <div>
                            <button className="btn btn-outline-danger" onClick={() => setIsDeleteOpen(true)}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Render appropriate component based on mode */}
            {!isEditing ? (
                <JobDetailView
                    selectedJob={selectedJob}
                    getStatusBadge={getStatusBadge}
                    formatDate={formatDate}
                />
            ) : (
                <JobDetailEdit
                    editData={selectedJob}
                    onSave={handleSave}
                    onCancel={cancelEdit}
                    formatDate={formatDate}
                />
            )}

            {/* Delete confirmation modal */}
            <DeleteApplication
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={onDeleteApplication}
                application={selectedJob}
                getStatusBadge={getStatusBadge}
            />
        </div>
    );
}

export default JobDetail;