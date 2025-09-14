import React, { useState } from 'react';
import ApplicationTable from './ApplicationTable';
import CreateApplication from './CreateApplication';

function ApplicationsPage({ jobApplications, setSelectedJob, getStatusBadge, formatDate, onCreateApplication, onDeleteApplication }) {
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    /* Filters jobs on the client-side based on their status and or what was typed in the search box*/
    const filteredJobs = jobApplications.filter(job => {
        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
        const matchesSearch = job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    }); 

    const handleCreateApplication = async (applicationData) => {
        try {

            const response = await fetch('/api/JobApplication', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });

            if (response.ok) {
                const newApplication = await response.json();
                onCreateApplication(newApplication);
            } else {
                // Log the error response for debugging
                const errorText = await response.text();
                console.error('Failed to create application. Status:', response.status);
                console.error('Error details:', errorText);
                alert(`Failed to create application: ${errorText || response.statusText}`);
            }
        } catch (error) {
            console.error('Error creating application:', error);
            alert('An error occurred while creating the application. Please try again.');
        }
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-md-4">
                        <h2>Job Applications</h2>
                    </div>
                    <div className="col-md-8">
                        <div className="d-flex gap-2">
                            <input type="text" className="form-control" placeholder="Search companies or roles..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offered">Offered</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Withdrawn">Withdrawn</option>
                            </select>
                            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)} title="Create New Application">
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationTable filteredJobs={filteredJobs} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate} onDeleteApplication={onDeleteApplication} />
            <CreateApplication isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateApplication}/>
        </div>
    );
}

export default ApplicationsPage;