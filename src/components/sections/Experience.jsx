import { Plus, Trash2 } from 'lucide-react';

const Experience = ({ data = [], onChange }) => {
    const handleAdd = () => {
        onChange([
            ...data,
            {
                id: crypto.randomUUID(),
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
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
                <h2 className="panel-title" style={{ marginBottom: 0 }}>Experience</h2>
                <button className="btn btn-secondary btn-icon-only" onClick={handleAdd} title="Add Experience">
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
                {data.map((item, index) => (
                    <div key={item.id} className="cv-item-box">
                        <div className="cv-item-actions">
                            <button
                                className="btn btn-danger btn-icon-only"
                                onClick={() => handleRemove(item.id)}
                                title="Remove Experience"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Company</label>
                            <input
                                type="text"
                                value={item.company}
                                onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                                placeholder="e.g. Google"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Position</label>
                            <input
                                type="text"
                                value={item.position}
                                onChange={(e) => handleChange(item.id, 'position', e.target.value)}
                                placeholder="e.g. Software Engineer"
                            />
                        </div>
                        <div className="form-row" style={{ marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="text"
                                    value={item.startDate}
                                    onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                    placeholder="e.g. Jan 2020"
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="text"
                                    value={item.endDate}
                                    onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                                    placeholder="e.g. Present"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                Description
                                <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                                    (Puedes usar HTML para subrayar en color, ej: &lt;mark&gt;texto&lt;/mark&gt; o &lt;span style="color:red"&gt;rojo&lt;/span&gt;)
                                </span>
                            </label>
                            <textarea
                                value={item.description}
                                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                rows="3"
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </div>
                    </div>
                ))}
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No experience added. Click + to add one.</p>}
            </div>
        </div>
    );
};

export default Experience;
