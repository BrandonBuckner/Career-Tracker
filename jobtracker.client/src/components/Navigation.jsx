function Navigation({ activeView, onViewChange, selectedJob }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={(e) => { if (!selectedJob) onViewChange('dashboard'); e.preventDefault();}}>
                    <i className="bi bi-briefcase me-2"></i>Career Tracker
                </a>
                <div className="navbar-nav">
                    <a className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`} href="#"
                        onClick={(e) => { if (!selectedJob) onViewChange('dashboard'); e.preventDefault(); }}>
                        Dashboard
                    </a>
                    <a
                        className={`nav-link ${activeView === 'applications' ? 'active' : ''}`} href="#"
                        onClick={(e) => { if (!selectedJob) onViewChange('applications'); e.preventDefault(); }}>
                        Applications
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navigation; 