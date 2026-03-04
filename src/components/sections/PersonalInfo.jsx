const PersonalInfo = ({ data = {}, onChange }) => {
    const handleChange = (e) => {
        onChange({ ...data, [e.target.name]: e.target.value });
    };

    return (
        <div className="glass-panel">
            <h2 className="panel-title">Personal Information</h2>
            <div className="form-group">
                <label>Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={data.fullName || ''}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email || ''}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        placeholder="+1 234 567 890"
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={data.address || ''}
                    onChange={handleChange}
                    placeholder="City, Country"
                />
            </div>
            <div className="form-group">
                <label>Professional Summary</label>
                <textarea
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    rows="4"
                    placeholder="A brief summary of your professional background..."
                />
            </div>
        </div>
    );
};

export default PersonalInfo;
