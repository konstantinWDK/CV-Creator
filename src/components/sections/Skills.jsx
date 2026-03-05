import { useState } from 'react';
import { X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';

const Skills = ({ data = [], onChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires minimum distance of 5px to start dragging, so clicks on the delete button still work
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

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
            <h2 className="panel-title">Habilidades</h2>

            <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ej. JavaScript, React, Diseño UI..."
                    style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Añadir
                </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={data.map((d, i) => d.id || `skill-${i}`)} strategy={rectSortingStrategy}>
                        {data.map((skill, index) => {
                            const skillId = skill.id || `skill-${index}`;
                            return (
                                <SortableItem key={skillId} id={skillId}>
                                    {({ attributes, listeners }) => (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            border: '1px solid var(--glass-border)',
                                            padding: '5px 5px 5px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}>
                                            <div
                                                {...attributes}
                                                {...listeners}
                                                style={{ cursor: 'grab', display: 'flex', alignItems: 'center', opacity: 0.5 }}
                                                title="Arrastrar"
                                            >
                                                <GripVertical size={14} />
                                            </div>
                                            <span>{skill.name}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(skill.id);
                                                }}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: 'var(--danger)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '2px',
                                                    borderRadius: '50%'
                                                }}
                                                title="Eliminar"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </SortableItem>
                            );
                        })}
                    </SortableContext>
                </DndContext>
            </div>
            {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '10px' }}>No hay habilidades añadidas.</p>}
        </div>
    );
};

export default Skills;
