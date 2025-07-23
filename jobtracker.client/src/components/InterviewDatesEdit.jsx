import { useState } from 'react';

function InterviewDatesEdit({ interviewDates = [], onChange, formatDate }) {
    const [dates, setDates] = useState(interviewDates);
    const [newDate, setNewDate] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    // Add or update date
    const handleSaveDate = () => {
        if (!newDate) {
            alert('Please select a date');
            return;
        }

        // Convert to ISO string format for C# compatibility
        const isoDate = new Date(newDate).toISOString();

        let updatedDates;
        if (editingIndex !== null) {
            // Update existing date
            updatedDates = [...dates];
            updatedDates[editingIndex] = isoDate;
            setEditingIndex(null);
        } else {
            // Add new date
            updatedDates = [...dates, isoDate];
        }

        // Sort dates chronologically
        updatedDates.sort((a, b) => new Date(a) - new Date(b));

        setDates(updatedDates);
        onChange(updatedDates);

        // Reset form
        setNewDate('');
    };

    // Edit date
    const handleEdit = (index) => {
        // Convert ISO string to YYYY-MM-DD format for date input
        const date = new Date(dates[index]);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setNewDate(`${year}-${month}-${day}`);
        setEditingIndex(index);
    };

    // Delete date
    const handleDelete = (index) => {
        const updatedDates = dates.filter((_, i) => i !== index);
        setDates(updatedDates);
        onChange(updatedDates);
    };

    // Cancel edit
    const handleCancel = () => {
        setNewDate('');
        setEditingIndex(null);
    };

    return (
        <div>
            {/* Date List */}
            {dates.length > 0 && (
                <div className="mb-3">
                    {dates.map((date, index) => (
                        <div key={index} className="border rounded p-2 mb-2 bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small">
                                    Round {index + 1}: <strong>{formatDate(date)}</strong>
                                </span>
                                <div className="btn-group btn-group-sm">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleEdit(index)}
                                        title="Edit"
                                    >
                                        <div className="bi bi-pencil">Edit</div>
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => handleDelete(index)}
                                        title="Delete"
                                    >
                                        <div className="bi bi-trash">Delete</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            <div className="mb-2">
                <input
                    type="date"
                    className="form-control form-control-sm"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Select interview date"
                />
            </div>

            <div className="d-flex gap-2">
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveDate}
                    disabled={!newDate}
                >
                    {editingIndex !== null ? 'Update' : 'Add'} Date
                </button>
                {editingIndex !== null && (
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                )}
            </div>

            {/* Empty State */}
            {dates.length === 0 && (
                <p className="text-muted small text-center mt-3 mb-0">
                    No interviews scheduled yet
                </p>
            )}
        </div>
    );
}

export default InterviewDatesEdit;