import React from 'react';

const CVPreview = ({ data }) => {
    const { personalInfo, experience, education, skills } = data;

    return (
        <div className="a4-page" id="cv-preview-content">
            <div style={{ paddingBottom: '20px', borderBottom: '2px solid var(--accent-color)', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1d24', margin: 0 }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div style={{ display: 'flex', gap: '15px', color: '#475569', marginTop: '10px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.address && <span>{personalInfo.address}</span>}
                </div>
            </div>

            {personalInfo.summary && (
                <div style={{ marginBottom: '30px' }}>
                    <p style={{ color: '#334155', lineHeight: 1.6 }}>{personalInfo.summary}</p>
                </div>
            )}

            {experience && experience.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#ea580c', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Experiencia
                    </h2>
                    {experience.map(exp => (
                        <div key={exp.id} style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                                    {exp.position}{exp.company ? ` - ${exp.company}` : ''}
                                </h3>
                                <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>
                                    {exp.startDate} - {exp.endDate || 'Present'}
                                </span>
                            </div>
                            <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5, marginTop: '8px' }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                        </div>
                    ))}
                </div>
            )}

            {education && education.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#ea580c', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Educación
                    </h2>
                    {education.map(edu => (
                        <div key={edu.id} style={{ marginBottom: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>{edu.degree}</h3>
                                <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 600 }}>{edu.year}</span>
                            </div>
                            <h4 style={{ fontSize: '1rem', color: '#475569', margin: '5px 0' }}>{edu.institution}</h4>
                        </div>
                    ))}
                </div>
            )}

            {skills && skills.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.5rem', color: '#ea580c', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Habilidades
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {skills.map(skill => (
                            <span key={skill.id} style={{
                                background: '#e0e7ff',
                                color: '#4f46e5',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CVPreview;
