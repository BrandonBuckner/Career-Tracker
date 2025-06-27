import React, { useState, useEffect } from 'react';

function JobApplicationsList() {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                setLoading(true);
                setError(null); 

                const response = await fetch('/api/JobApplication');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setJobApplications(data);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching job applications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobApplications();
    }, []); 

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (jobApplications.length === 0) return <div>No job applications found</div>;

    return (
        <div class="text-center">
            <h1 class="py-3">Job Applications</h1>
            <table class="table table-hover pt-1 m-2">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Applied Date</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {jobApplications.map(app => (
                        <tr key={app.id}>
                            <td>{app.companyName}</td>
                            <td>{app.role}</td>
                            <td>{app.status}</td>
                            <td>{formatDate(app.applicationDate)}</td>
                            <td>{app.location}</td>
                            <td>{app.salaryEstimate}</td>
                            <td>{app.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default JobApplicationsList;