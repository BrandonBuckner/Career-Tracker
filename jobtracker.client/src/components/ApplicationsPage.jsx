import React, { useState } from 'react';
import ApplicationTable from './ApplicationTable';
import CreateApplication from './CreateApplication';

function ApplicationsPage({ jobApplications, setSelectedJob, getStatusBadge, formatDate, onCreateApplication }) {
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

    const handleCreateApplication = (applicationData) => {
        // Call the parent component's handler or make API call here
        if (onCreateApplication) {
            onCreateApplication(applicationData);
        }
        console.log('New application data:', applicationData);
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
                            { //TODO: Update to a big plus or something }
                            <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)} title="Create New Application">
                                +
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationTable filteredJobs={filteredJobs} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate}/>
            <CreateApplication isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateApplication}/>
        </div>
    );
}

export default ApplicationsPage;