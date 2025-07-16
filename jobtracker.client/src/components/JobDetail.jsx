import { useState } from 'react';
import JobDetailView from './JobDetailView';
import JobDetailEdit from './JobDetailEdit';

function JobDetail({ activeView, selectedJob, setSelectedJob, getStatusBadge, formatDate, onJobUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

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

                {!isEditing && (
                    <button className="btn btn-primary" onClick={startEdit}>
                        Edit
                    </button>
                )}
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
                />
            )}
        </div>
    );
}

export default JobDetail;