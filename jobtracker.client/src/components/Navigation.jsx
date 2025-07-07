function Navigation({ activeView, onViewChange }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}>
                    <i className="bi bi-briefcase me-2"></i>Job Tracker
                </a>
                <div className="navbar-nav">
                    <a className={`nav-link ${activeView === 'dashboard' ? 'active' : ''}`} href="#"
                        onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}>
                        Dashboard
                    </a>
                    <a
                        className={`nav-link ${activeView === 'applications' ? 'active' : ''}`} href="#"
                        onClick={(e) => { e.preventDefault(); onViewChange('applications'); }}>
                        Applications
                    </a>
                </div>
            </div>
        </nav>
    );
}

export default Navigation; 