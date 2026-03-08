import React, { useState } from 'react';
import { Sparkles, Languages, Loader2, AlertCircle, CheckCircle, Info, Copy, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const AISection = ({ currentCV, onChange }) => {
    const { t } = useTranslation();
    const { token, isAuthenticated } = useAuth();
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://api.cv-creator.webdesignerk.com';

    const handleGenerate = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_URL}/api/ai/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || `Server Error (${response.status})`);
            }

            const data = await response.json();
            // Completely overwrite with AI generated content for a "Full CV" experience
            onChange({
                ...currentCV,
                personalInfo: data.personalInfo || currentCV.personalInfo,
                experience: data.experience || [],
                education: data.education || [],
                skills: data.skills || []
            });
            setSuccess(t('ai.generateSuccess') || 'CV generado con éxito');
            setInputText('');
        } catch (err) {
            console.error('AI Flow Error:', err);
            setError(err.message === 'Failed to fetch'
                ? 'No se pudo conectar con el servidor. Verifica que la API esté activa.'
                : (err.message || 'Error de conexión con el servicio de IA'));
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="ai-section glass-panel" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                <Sparkles size={48} className="text-accent" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                <h2 style={{ marginBottom: '1rem' }}>{t('ai.title') || 'Asistente de IA'}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {t('ai.loginRequired') || 'Inicia sesión para usar las funciones de IA y generar tu CV automáticamente.'}
                </p>
                <div style={{ padding: '1rem', background: 'rgba(234, 88, 12, 0.05)', borderRadius: '12px', border: '1px dashed var(--accent-color)', fontSize: '0.9rem' }}>
                    <Info size={18} style={{ marginBottom: '8px' }} />
                    <p>La IA puede leer tu experiencia y crear un CV profesional en segundos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="ai-section glass-panel" style={{ padding: '1.5rem' }}>
            <div className="section-header-ai" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '12px', background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(249, 115, 22, 0.1))', borderRadius: '16px', marginBottom: '1rem' }}>
                    <Wand2 className="text-accent" size={32} />
                </div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('ai.title') || 'AI Command Center'}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                    {t('ai.subtitle') || 'Genera tu CV completo a partir de un bloque de información.'}
                </p>
            </div>

            <div className="ai-unified-entry" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700 }}>1</div>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{t('ai.genTitle') || 'Cargar información'}</h3>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {t('ai.genDescFull') || 'Pega aquí toda tu información: experiencia laboral, estudios, habilidades y datos de contacto.'}
                </p>

                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t('ai.genPlaceholderFull') || 'Ej: Mi nombre es Juan Pérez, soy desarrollador con 10 años de experiencia...'}
                    style={{
                        minHeight: '220px',
                        marginBottom: '1.5rem',
                        resize: 'vertical',
                        padding: '1rem',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                    }}
                />

                <div style={{ display: 'flex' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleGenerate}
                        disabled={loading || !inputText.trim()}
                        style={{ width: '100%', gap: '10px', height: '50px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700 }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {t('ai.genBtn') || 'Generar'}
                    </button>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', display: 'flex', gap: '12px' }}>
                    <Info size={20} style={{ color: '#d97706', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0 }}>
                        <strong>Nota:</strong> Al generar un CV nuevo se sobrescribirá la información actual. La traducción creará un documento nuevo.
                    </p>
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', border: '1px solid #fee2e2' }}>
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
            {success && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0fdf4', color: '#10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', border: '1px solid #dcfce7' }}>
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}
        </div>
    );
};

export default AISection;
