import { Plus, Trash2, GripVertical } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // ES6
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from '../ui/SortableItem';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale/es';
import { enUS } from 'date-fns/locale/en-US';
import { parse, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';

const Quill = ReactQuill.Quill;
if (Quill) {
    const ColorStyle = Quill.import('attributors/style/color');
    const BackgroundStyle = Quill.import('attributors/style/background');
    Quill.register(ColorStyle, true);
    Quill.register(BackgroundStyle, true);
}

registerLocale('es', es);

const Experience = ({ data = [], onChange }) => {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language.startsWith('en') ? 'en' : 'es';
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
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                isCurrent: false,
                showDuration: false,
                description: ''
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
                <h2 className="panel-title" style={{ marginBottom: 0 }}>{t('forms.experience.title')}</h2>
                <button className="btn btn-secondary btn-icon-only" onClick={handleAdd} title={t('forms.experience.add')}>
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
                                                    title={t('forms.experience.dragHelp')}
                                                    style={{ cursor: 'grab' }}
                                                >
                                                    <GripVertical size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-icon-only"
                                                    onClick={() => handleRemove(index)}
                                                    title={t('forms.experience.delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                <label>{t('forms.experience.company')}</label>
                                                <input
                                                    type="text"
                                                    value={item.company}
                                                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                                                    placeholder={t('forms.experience.companyPlaceholder')}
                                                />
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                                <label>{t('forms.experience.position')}</label>
                                                <input
                                                    type="text"
                                                    value={item.position}
                                                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                                                    placeholder={t('forms.experience.positionPlaceholder')}
                                                />
                                            </div>
                                            <div className="form-row" style={{ marginBottom: '1rem' }}>
                                                <div className="form-group date-picker-group">
                                                    <label>{t('forms.experience.startDate')}</label>
                                                    <DatePicker
                                                        selected={parseMonthString(item.startDate)}
                                                        onChange={(date) => handleChange(index, 'startDate', formatMonthString(date))}
                                                        dateFormat="MM/yyyy"
                                                        showMonthYearPicker
                                                        locale={currentLocale}
                                                        placeholderText={t('forms.experience.selectDate')}
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="form-group date-picker-group">
                                                    <label>{t('forms.experience.endDate')}</label>
                                                    <DatePicker
                                                        selected={parseMonthString(item.endDate)}
                                                        onChange={(date) => handleChange(index, 'endDate', formatMonthString(date))}
                                                        dateFormat="MM/yyyy"
                                                        showMonthYearPicker
                                                        locale={currentLocale}
                                                        disabled={item.isCurrent}
                                                        placeholderText={item.isCurrent ? t('forms.experience.present') : t('forms.experience.selectDate')}
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
                                                        const updatedItem = { ...item, isCurrent: isChecked };
                                                        if (isChecked) updatedItem.endDate = '';
                                                        onChange(data.map((it, i) => i === index ? updatedItem : it));
                                                    }}
                                                    style={{ width: 'auto', margin: 0 }}
                                                />
                                                <label htmlFor={`current-${item.id}`} style={{ margin: 0, fontWeight: 500 }}>
                                                    {t('forms.experience.isCurrent')}
                                                </label>
                                            </div>
                                            <div className="form-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                                <input
                                                    type="checkbox"
                                                    id={`duration-${item.id}`}
                                                    checked={item.showDuration || false}
                                                    onChange={(e) => handleChange(index, 'showDuration', e.target.checked)}
                                                    style={{ width: 'auto', margin: 0 }}
                                                />
                                                <label htmlFor={`duration-${item.id}`} style={{ margin: 0, fontWeight: 500 }}>
                                                    {t('forms.experience.showDuration')}
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label>
                                                    {t('forms.experience.description')}
                                                </label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={item.description}
                                                    onChange={(content) => handleChange(index, 'description', content)}
                                                    modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            [{ 'list': 'bullet' }],
                                                            ['clean']
                                                        ]
                                                    }}
                                                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                                    placeholder={t('forms.experience.descriptionPlaceholder')}
                                                />
                                            </div>
                                        </>
                                    )}
                                </SortableItem>
                            );
                        })}
                    </SortableContext>
                </DndContext>
                {data.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t('forms.experience.noExperience')}</p>}
            </div>
        </div>
    );
};

export default Experience;
