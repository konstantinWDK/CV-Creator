import { Plus, Trash2, GripVertical } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // ES6
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import { parse, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const Quill = ReactQuill.Quill;
if (Quill) {
    const ColorStyle = Quill.import('attributors/style/color');
    const BackgroundStyle = Quill.import('attributors/style/background');
    Quill.register(ColorStyle, true);
    Quill.register(BackgroundStyle, true);
}

registerLocale('es', es);

const Experience = ({ data = [], onChange }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = data.findIndex((item) => item.id === active.id);
            const newIndex = data.findIndex((item) => item.id === over.id);
            const newData = [...data];
            const [removed] = newData.splice(oldIndex, 1);
            newData.splice(newIndex, 0, removed);
            onChange(newData);
        }
    };

    // Helper for datepicker to handle "YYYY-MM" string which components expect
    const parseMonthString = (monthStr) => {
        if (!monthStr) return null;
        try {
            const parsed = parse(monthStr, 'yyyy-MM', new Date());
            if (isNaN(parsed.getTime())) return null;
            return parsed;
        } catch {
            return null;
        }
    };

    const formatMonthString = (date) => {
        if (!date || isNaN(date.getTime())) return '';
        return format(date, 'yyyy-MM');
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
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={data.map((d, i) => d.id || `exp-${i}`)} strategy={verticalListSortingStrategy}>
                        {data.map((item, index) => {
                            const itemId = item.id || `exp-${index}`;
                            return (
                                <SortableItem key={itemId} id={itemId} className="cv-item-box">
                                    {({ attributes, listeners }) => (
                                        <>
                                            <div className="cv-item-actions">
                                                <button
                                                    className="btn btn-secondary btn-icon-only drag-handle"
                                                    {...attributes}
                                                    {...listeners}
                                                    title="Arrastrar para reordenar"
                                                    style={{ cursor: 'grab' }}
                                                >
                                                    <GripVertical size={16} />
                                                </button>
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
                                                <div className="form-group date-picker-group">
                                                    <label>Fecha de Inicio</label>
                                                    <DatePicker
                                                        selected={parseMonthString(item.startDate)}
                                                        onChange={(date) => handleChange(item.id, 'startDate', formatMonthString(date))}
                                                        dateFormat="MM/yyyy"
                                                        showMonthYearPicker
                                                        locale="es"
                                                        placeholderText="Seleccionar fecha"
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="form-group date-picker-group">
                                                    <label>Fecha de Fin</label>
                                                    <DatePicker
                                                        selected={parseMonthString(item.endDate)}
                                                        onChange={(date) => handleChange(item.id, 'endDate', formatMonthString(date))}
                                                        dateFormat="MM/yyyy"
                                                        showMonthYearPicker
                                                        locale="es"
                                                        disabled={item.isCurrent}
                                                        placeholderText={item.isCurrent ? 'Actualidad' : 'Seleccionar fecha'}
                                                        className="w-full"
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
                                                        handleChange(item.id, 'isCurrent', isChecked);
                                                        if (isChecked) handleChange(item.id, 'endDate', '');
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
                                                    Mostrar tiempo calculado en vez de rango de fechas
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
                                        </>
                                    )}
                                </SortableItem>
                            );
                        })}
                    </SortableContext>
                </DndContext>
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Aún no hay experiencia. Haz clic en + para añadir.</p>}
            </div>
        </div>
    );
};

export default Experience;
