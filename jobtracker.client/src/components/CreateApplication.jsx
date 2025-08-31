import React, { useState } from 'react';

const CreateApplication = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        role: '',
        roleDescription: '',
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        lastHeardDate: '',
        interviewDates: [''],
        jobType: '',
        location: '',
        salaryEstimate: '',
        jobLink: '',
        referral: false,
        notes: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleInterviewDateChange = (index, value) => {
        const newDates = [...formData.interviewDates];
        newDates[index] = value;
        setFormData(prev => ({
            ...prev,
            interviewDates: newDates
        }));
    };

    const addInterviewDate = () => {
        setFormData(prev => ({
            ...prev,
            interviewDates: [...prev.interviewDates, '']
        }));
    };

    const removeInterviewDate = (index) => {
        const newDates = formData.interviewDates.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            interviewDates: newDates.length === 0 ? [''] : newDates
        }));
    };

    const validateData = () => {
        const newErrors = {};
        const requiredFields = ['companyName', 'role', 'status', 'applicationDate'];

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                const fieldLabel = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                newErrors[field] = `${fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)} is required`;
            }
        });

        const currentTime = new Date().toISOString().split('T')[0];

        // Validate application date
        if (formData.applicationDate && new Date(formData.applicationDate) > currentTime) {
            newErrors.applicationDate = 'Application date cannot be in the future';
        }

        // Validate last heard date
        if (formData.lastHeardDate) {
            if (new Date(formData.lastHeardDate) > currentTime) {
                newErrors.lastHeardDate = 'Last heard date cannot be in the future';
            } else if (formData.applicationDate && new Date(formData.lastHeardDate) < new Date(formData.applicationDate)) {
                newErrors.lastHeardDate = 'Last heard date cannot be before application date';
            }
        }

        // Validate job link URL if provided
        if (formData.jobLink && formData.jobLink.trim() !== '') {
            try {
                new URL(formData.jobLink);
            } catch {
                newErrors.jobLink = 'Please enter a valid URL';
            }
        }

        return newErrors;
    };

    const resetFormData = () =>
        setFormData({
            companyName: '',
            role: '',
            roleDescription: '',
            applicationDate: new Date().toISOString().split('T')[0],
            status: 'Applied',
            lastHeardDate: '',
            interviewDates: [''],
            jobType: '',
            location: '',
            salaryEstimate: '',
            jobLink: '',
            referral: false,
            notes: ''
    });

    const handleSubmit = () => {
        const validationErrors = validateData();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Prepare data for API - convert empty strings to null for optional fields
        const cleanedData = {
            companyName: formData.companyName,
            role: formData.role,
            roleDescription: formData.roleDescription || null,
            applicationDate: formData.applicationDate,
            status: formData.status,
            lastHeardDate: formData.lastHeardDate || null,
            interviewDates: formData.interviewDates.filter(date => date !== ''),
            jobType: formData.jobType || null,
            location: formData.location || null,
            salaryEstimate: formData.salaryEstimate || null,
            jobLink: formData.jobLink || null,
            referral: formData.referral,
            notes: formData.notes || null
        };

        // Send data directly, not wrapped in an object
        onSubmit(cleanedData);
        resetFormData();
        setErrors({});
        onClose();
    };

    const handleClose = () => {
        resetFormData();
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-lg modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Job Application</h5>
                            <button type="button" className="btn-close" onClick={handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="companyName" className="form-label">
                                        Company Name <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                        id="companyName" name="companyName" value={formData.companyName} onChange={handleChange}
                                    />
                                    {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="role" className="form-label">
                                        Role <span className="text-danger">*</span>
                                    </label>
                                    <input type="text" className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                        id="role" name="role" value={formData.role} onChange={handleChange}
                                    />
                                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="roleDescription" className="form-label">Role Description</label>
                                <textarea className="form-control" id="roleDescription" name="roleDescription" rows="3"
                                    value={formData.roleDescription} onChange={handleChange} placeholder="Describe the role...">
                                </textarea>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="applicationDate" className="form-label">
                                        Application Date <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="date" className={`form-control ${errors.applicationDate ? 'is-invalid' : ''}`}
                                        id="applicationDate" name="applicationDate" value={formData.applicationDate} onChange={handleChange}
                                    />
                                    {errors.applicationDate && <div className="invalid-feedback">{errors.applicationDate}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="status" className="form-label">
                                        Status <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${errors.status ? 'is-invalid' : ''}`} id="status"
                                        name="status" value={formData.status} onChange={handleChange}
                                    >
                                        <option value="Applied">Applied</option>
                                        <option value="Interviewing">Interviewing</option>
                                        <option value="Offered">Offered</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Withdrawn">Withdrawn</option>
                                    </select>
                                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="lastHeardDate" className="form-label">Last Heard Date</label>
                                    <input type="date" className={`form-control ${errors.lastHeardDate ? 'is-invalid' : ''}`}
                                        id="lastHeardDate" name="lastHeardDate" value={formData.lastHeardDate} onChange={handleChange}
                                    />
                                    {errors.lastHeardDate && <div className="invalid-feedback">{errors.lastHeardDate}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="jobType" className="form-label">Job Type</label>
                                    <select className="form-select" id="jobType" name="jobType" value={formData.jobType}onChange={handleChange}>
                                        <option value="">Select Job Type</option>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Interview Dates</label>
                                {formData.interviewDates.map((date, index) => (
                                    <div key={index} className="input-group mb-2">
                                        <input type="datetime-local" className="form-control" value={date} onChange={(e) => handleInterviewDateChange(index, e.target.value)}/>
                                        <button type="button" className="btn btn-outline-danger" onClick={() => removeInterviewDate(index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addInterviewDate}>
                                    Add Interview Date
                                </button>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="location" className="form-label">Location</label>
                                    <input type="text" className="form-control" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., New York, NY or Remote"/>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="salaryEstimate" className="form-label">Salary Estimate</label>
                                    <input type="text" className="form-control" id="salaryEstimate" name="salaryEstimate" value={formData.salaryEstimate} onChange={handleChange} placeholder="e.g., $80,000 - $100,000"/>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="jobLink" className="form-label">Job Link</label>
                                <input type="url" className={`form-control ${errors.jobLink ? 'is-invalid' : ''}`} id="jobLink"
                                    name="jobLink" value={formData.jobLink} onChange={handleChange} placeholder="https://example.com/job-posting"
                                />
                                {errors.jobLink && <div className="invalid-feedback">{errors.jobLink}</div>}
                            </div>

                            <div className="mb-3">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="referral" name="referral" checked={formData.referral} onChange={handleChange}/>
                                    <label className="form-check-label" htmlFor="referral">
                                        Applied through referral
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="notes" className="form-label">Notes</label>
                                <textarea className="form-control" id="notes" name="notes" rows="3" value={formData.notes}
                                    onChange={handleChange} placeholder="Add any notes about this application...">
                                </textarea>
                            </div>

                            {/* Error Summary Section */}
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger" role="alert">
                                    <strong>Please correct the following errors:</strong>
                                    <ul className="mb-0 mt-2">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                Create Application
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateApplication;