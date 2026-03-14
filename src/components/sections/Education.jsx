import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';
import { useTranslation } from 'react-i18next';

const Education = ({ data = [], onChange }) => {
    const { t } = useTranslation();
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAdd = () => {
        onChange([
            {
                id: crypto.randomUUID(),
                institution: '',
                degree: '',
                year: ''
            },
            ...data
        ]);
    };

    const handleRemove = (index) => {
        onChange(data.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        onChange(data.map((item, i) => i === index ? { ...item, [field]: value } : item));
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

    return (
        <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="panel-title" style={{ marginBottom: 0 }}>{t('forms.education.title')}</h2>
                <button className="btn btn-secondary btn-icon-only" onClick={handleAdd} title={t('forms.education.add')}>
                    <Plus size={18} />
                </button>
            </div>

            <div style={{ marginTop: 'var(--space-4)' }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={data.map((d, i) => d.id || `edu-${i}`)} strategy={verticalListSortingStrategy}>
                        {data.map((item, index) => {
                            const itemId = item.id || `edu-${index}`;
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
                                                    onClick={() => handleRemove(index)}
                                                    title={t('forms.education.delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                <label>{t('forms.education.school')}</label>
                                                <input
                                                    type="text"
                                                    value={item.institution}
                                                    onChange={(e) => handleChange(index, 'institution', e.target.value)}
                                                    placeholder={t('forms.education.schoolPlaceholder')}
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>{t('forms.education.degree')}</label>
                                                    <input
                                                        type="text"
                                                        value={item.degree}
                                                        onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                                        placeholder={t('forms.education.degreePlaceholder')}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>{t('forms.education.endDate')}</label>
                                                    <input
                                                        type="text"
                                                        value={item.year}
                                                        onChange={(e) => handleChange(index, 'year', e.target.value)}
                                                        placeholder="Ej. 2016 - 2020"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </SortableItem>
                            );
                        })}
                    </SortableContext>
                </DndContext>
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('forms.education.noEducation')}</p>}
            </div>
        </div>
    );
};

export default Education;
