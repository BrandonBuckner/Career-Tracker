//TODO: Configure frontend react elements and fetch data from api controller
import React, { useState, useEffect } from 'react';

function JobApplicationsList() {
    const [jobApplications, setJobApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fakeData = [
            {
                id: 1,
                companyName: "Test Company 1",
                role: "Software Developer",
                status: "Applied",
                applicationDate: "2024-01-15",
                location: "Remote",
                salaryEstimate: "$80k-100k",
                notes: "Applied through website"
            },
            {
                id: 2,
                companyName: "Test Company 2",
                role: "Frontend Developer",
                status: "Interview",
                applicationDate: "2024-01-10",
                location: "New York",
                salaryEstimate: "$90k-110k",
                notes: "Phone screen completed"
            }
        ];

        setTimeout(() => {
            setJobApplications(fakeData);
            setLoading(false);
        }, 1000);

    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (jobApplications.length === 0) return <div>No job applications found</div>;

    return (
        <div>
            <h1>Job Applications</h1>
            <table border="1">
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