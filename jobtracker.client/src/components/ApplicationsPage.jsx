import ApplicationTable from './ApplicationTable';
function ApplicationsPage({searchTerm, setSearchTerm, filterStatus, setFilterStatus, filteredJobs, setSelectedJob, getStatusBadge, formatDate }) {
    return (
        <div>
            <div className="container-fluid">
                <div className="row mb-4">
                    <div className="col-md-6">
                        <h2>Job Applications</h2>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex gap-2">
                            <input type="text" className="form-control" placeholder="Search companies or roles..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer">Offer</option>
                                <option value="Rejected">Rejected</option>
                                <option value="Withdrawn">Withdrawn</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <ApplicationTable filteredJobs={filteredJobs} setSelectedJob={setSelectedJob} getStatusBadge={getStatusBadge} formatDate={formatDate} />
        </div>
    );
}

export default ApplicationsPage;