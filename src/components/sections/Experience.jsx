import { Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // ES6

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
                isCurrent: false,
                showDuration: false,
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
                <h2 className="panel-title" style={{ marginBottom: 0 }}>Experiencia</h2>
                <button className="btn btn-secondary btn-icon-only" onClick={handleAdd} title="Añadir Experiencia">
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
                                title="Eliminar Experiencia"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Empresa</label>
                            <input
                                type="text"
                                value={item.company}
                                onChange={(e) => handleChange(item.id, 'company', e.target.value)}
                                placeholder="Ej. Google"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Puesto</label>
                            <input
                                type="text"
                                value={item.position}
                                onChange={(e) => handleChange(item.id, 'position', e.target.value)}
                                placeholder="Ej. Desarrollador Web"
                            />
                        </div>
                        <div className="form-row" style={{ marginBottom: '1rem' }}>
                            <div className="form-group">
                                <label>Fecha de Inicio</label>
                                <input
                                    type="month"
                                    value={item.startDate}
                                    onChange={(e) => handleChange(item.id, 'startDate', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fecha de Fin</label>
                                <input
                                    type="month"
                                    value={item.endDate}
                                    onChange={(e) => handleChange(item.id, 'endDate', e.target.value)}
                                    disabled={item.isCurrent}
                                    style={{ opacity: item.isCurrent ? 0.5 : 1, cursor: item.isCurrent ? 'not-allowed' : 'text' }}
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                id={`current-${item.id}`}
                                checked={item.isCurrent || false}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    onChange(data.map(d => {
                                        if (d.id === item.id) {
                                            return { ...d, isCurrent: isChecked, endDate: isChecked ? '' : d.endDate };
                                        }
                                        return d;
                                    }));
                                }}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor={`current-${item.id}`} style={{ margin: 0, fontWeight: 500 }}>
                                Sigo activo en este puesto actualmente
                            </label>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="checkbox"
                                id={`duration-${item.id}`}
                                checked={item.showDuration || false}
                                onChange={(e) => handleChange(item.id, 'showDuration', e.target.checked)}
                                style={{ width: 'auto', margin: 0 }}
                            />
                            <label htmlFor={`duration-${item.id}`} style={{ margin: 0, fontWeight: 500 }}>
                                Mostrar tiempo calculado (Ej. 1 año y 3 meses) en vez de rango de fechas
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Descripción
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={item.description}
                                onChange={(content) => handleChange(item.id, 'description', content)}
                                modules={{
                                    toolbar: [
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'list': 'bullet' }],
                                        ['clean']
                                    ]
                                }}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                placeholder="Describe tus responsabilidades y logros..."
                            />
                        </div>
                    </div>
                ))}
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aún no hay experiencia. Haz clic en + para añadir.</p>}
            </div>
        </div>
    );
};

export default Experience;
