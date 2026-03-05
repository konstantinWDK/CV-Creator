import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Globe, Github, Linkedin } from 'lucide-react';
import { formatPeriod, calculateDuration } from '../../utils/formatDate';

const MinimalTemplate = ({ data }) => {
    const { personalInfo, experience, education, skills } = data;

    return (
        <div className="a4-page" id="cv-preview-content" style={{ padding: '3mm 4mm' }}>
            <div style={{ paddingBottom: '20px', borderBottom: '2px solid var(--accent-color)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1a1d24', margin: 0 }}>
                        {personalInfo.fullName || 'Tu Nombre'}
                    </h1>
                    <div style={{ display: 'flex', gap: '15px', color: '#475569', marginTop: '10px', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.address && <span>{personalInfo.address}</span>}
                        {personalInfo.website && <span style={{ color: 'var(--accent-color)' }}>{personalInfo.website}</span>}
                    </div>
                </div>
                {personalInfo.photo && (
                    <div style={{ marginLeft: '20px', flexShrink: 0 }}>
                        <img
                            src={personalInfo.photo}
                            alt="Profile"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%', border: '3px solid var(--accent-color)' }}
                        />
                    </div>
                )}
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
                                    {exp.showDuration ? calculateDuration(exp.startDate, exp.endDate) : formatPeriod(exp.startDate, exp.endDate)}
                                </span>
                            </div>
                            <p style={{
                                color: '#334155',
                                fontSize: '0.95rem',
                                lineHeight: 1.5,
                                marginTop: '8px',
                                wordBreak: 'normal',
                                overflowWrap: 'break-word'
                            }} dangerouslySetInnerHTML={{ __html: exp.description }} />
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

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                {skills && skills.length > 0 && (
                    <div style={{ flex: 1 }}>
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

                {personalInfo.showQrCode && personalInfo.website && (
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                        <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <QRCodeSVG value={personalInfo.website} size={80} level="M" style={{ marginBottom: '8px' }} />
                            {(!personalInfo.qrCodeType || personalInfo.qrCodeType === 'link') && <Globe size={18} color="#64748b" />}
                            {personalInfo.qrCodeType === 'github' && <Github size={18} color="#64748b" />}
                            {personalInfo.qrCodeType === 'linkedin' && <Linkedin size={18} color="#64748b" />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MinimalTemplate;
