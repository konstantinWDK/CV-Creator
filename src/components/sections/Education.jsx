import { Plus, Trash2 } from 'lucide-react';

const Education = ({ data = [], onChange }) => {
    const handleAdd = () => {
        onChange([
            ...data,
            {
                id: crypto.randomUUID(),
                institution: '',
                degree: '',
                year: ''
            }
        ]);
    };

    const handleRemove = (id) => {
        onChange(data.filter(item => item.id !== id));
    };

    const handleChange = (id, field, value) => {
        onChange(data.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="panel-title" style={{ marginBottom: 0 }}>Education</h2>
                <button className="btn btn-secondary btn-icon-only" onClick={handleAdd} title="Add Education">
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
                {data.map((item) => (
                    <div key={item.id} className="cv-item-box">
                        <div className="cv-item-actions">
                            <button
                                className="btn btn-danger btn-icon-only"
                                onClick={() => handleRemove(item.id)}
                                title="Remove Education"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Institution</label>
                            <input
                                type="text"
                                value={item.institution}
                                onChange={(e) => handleChange(item.id, 'institution', e.target.value)}
                                placeholder="e.g. University of Hard Knocks"
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Degree / Field of Study</label>
                                <input
                                    type="text"
                                    value={item.degree}
                                    onChange={(e) => handleChange(item.id, 'degree', e.target.value)}
                                    placeholder="e.g. B.Sc. Computer Science"
                                />
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="text"
                                    value={item.year}
                                    onChange={(e) => handleChange(item.id, 'year', e.target.value)}
                                    placeholder="e.g. 2016 - 2020"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No education added. Click + to add one.</p>}
            </div>
        </div>
    );
};

export default Education;
