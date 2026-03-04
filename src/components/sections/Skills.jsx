import { useState } from 'react';
import { X } from 'lucide-react';

const Skills = ({ data = [], onChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newSkill.trim() === '') return;

        onChange([
            ...data,
            {
                id: crypto.randomUUID(),
                name: newSkill.trim()
            }
        ]);
        setNewSkill('');
    };

    const handleRemove = (id) => {
        onChange(data.filter(item => item.id !== id));
    };

    return (
        <div className="glass-panel">
            <h2 className="panel-title">Skills</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. JavaScript, React, Node.js..."
                    style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Add
                </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {data.map((skill) => (
                    <div key={skill.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.9rem'
                    }}>
                        <span>{skill.name}</span>
                        <button
                            type="button"
                            onClick={() => handleRemove(skill.id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>No skills added.</p>}
        </div>
    );
};

export default Skills;
