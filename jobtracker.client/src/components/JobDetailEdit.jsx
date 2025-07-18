import { useState } from 'react';

function JobDetailEdit({ editData, onSave, onCancel }) {
    const [formData, setFormData] = useState(editData);
    const [errors, setErrors] = useState({});

    // Handle field changes
    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({
            // Saves previous state and updates new field
            ...prev,
            [fieldName]: value
        }));

        // Clear error for this field
        if (errors[fieldName]) {
            setErrors(prev => ({ ...prev, [fieldName]: null }));
        }
    };

    // Validate required fields
    const validateData = () => {
        const newErrors = {};
        const requiredFields = ['companyName', 'role', 'status', 'applicationDate'];

        requiredFields.forEach(field => {
            // Check if the field is empty or contains only whitespace
            if (!formData[field] || formData[field].toString().trim() === '') {
                newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
            }
        });

        return newErrors;
    };

    // Handle save
    const handleSave = async () => {
        const validationErrors = validateData();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await fetch(`api/JobApplication/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Update the parent component
                onSave(formData);
            } else {
                console.error('Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    };

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-header bg-primary-subtle">
                        <div className="mb-2">
                            <input
                                className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                value={formData.role || ''}
                                onChange={(e) => handleFieldChange('role', e.target.value)}
                                placeholder="Job Role"

                            />
                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                        </div>
                        <div>
                            <input
                                className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                value={formData.companyName || ''}
                                onChange={(e) => handleFieldChange('companyName', e.target.value)}
                                placeholder="Company Name"
                            />
                            {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Status <span className="text-danger">*</span></label>
                                <select
                                    className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                                    value={formData.status || ''}
                                    onChange={(e) => handleFieldChange('status', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offered">Offered</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Withdrawn">Withdrawn</option>
                                </select>
                                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Job Type</label>
                                <select
                                    className="form-select"
                                    value={formData.jobType || ''}
                                    onChange={(e) => handleFieldChange('jobType', e.target.value)}
                                >
                                    <option value="">Select Job Type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.location || ''}
                                    onChange={(e) => handleFieldChange('location', e.target.value)}
                                    placeholder="Job Location"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Salary Estimate</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.salaryEstimate || ''}
                                    onChange={(e) => handleFieldChange('salaryEstimate', e.target.value)}
                                    placeholder="e.g., $60,000 - $80,000"
                                />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Application Date <span className="text-danger">*</span></label>
                                <input
                                    type="date"
                                    className={`form-control ${errors.applicationDate ? 'is-invalid' : ''}`}
                                    value={formData.applicationDate ? formData.applicationDate.split('T')[0] : ''}
                                    onChange={(e) => handleFieldChange('applicationDate', e.target.value)}
                                />
                                {errors.applicationDate && <div className="invalid-feedback">{errors.applicationDate}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Last Contact Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.lastHeardDate ? formData.lastHeardDate.split('T')[0] : ''}
                                    onChange={(e) => handleFieldChange('lastHeardDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="referralCheck"
                                    checked={formData.referral || false}
                                    onChange={(e) => handleFieldChange('referral', e.target.checked)}
                                />
                                <label className="form-check-label" htmlFor="referralCheck">
                                    Applied through referral
                                </label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Role Description</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.roleDescription || ''}
                                onChange={(e) => handleFieldChange('roleDescription', e.target.value)}
                                placeholder="Describe the role..."
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={formData.notes || ''}
                                onChange={(e) => handleFieldChange('notes', e.target.value)}
                                placeholder="Add any notes about this application..."
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Job Link</label>
                            <input
                                type="url"
                                className="form-control"
                                value={formData.jobLink || ''}
                                onChange={(e) => handleFieldChange('jobLink', e.target.value)}
                                placeholder="https://example.com/job-posting"
                            />
                        </div>

                        <div className="d-flex gap-2 justify-content-between">
                            <button className="btn btn-secondary" onClick={onCancel}>
                                Cancel
                            </button>

                            <button className="btn btn-success" onClick={handleSave}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="mb-0">Interview Timeline</h6>
                    </div>
                    <div className="card-body">
                        <p className="text-muted">Interview date editing coming soon...</p>
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-header">
                        <h6 className="mb-0">Application Details</h6>
                    </div>
                    <div className="card-body">
                        <div className="mb-2">
                            <small className="text-muted">Application ID:</small><br />
                            <span>#{formData.id}</span>
                        </div>
                        <div className="mb-2">
                            <small className="text-muted">Days Since Applied:</small><br />
                            <span>{formData.applicationDate ? Math.floor((new Date() - new Date(formData.applicationDate)) / (1000 * 60 * 60 * 24)) : 0} days</span>
                        </div>
                        {formData.lastHeardDate && ( // Calculate days since last contact only if lastHeardDate is provided 
                            <div className="mb-2">
                                <small className="text-muted">Days Since Last Contact:</small><br />
                                <span>{Math.floor((new Date() - new Date(formData.lastHeardDate)) / (1000 * 60 * 60 * 24))} days</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetailEdit;