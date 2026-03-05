import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Globe, Github, Linkedin } from 'lucide-react';
import { formatPeriod, calculateDuration } from '../../utils/formatDate';

const MinimalPlusTemplate = ({ data }) => {
    const { personalInfo, experience, education, skills } = data;

    return (
        <div className="a4-page minimal-plus" id="cv-preview-content" style={{ padding: '15mm 15mm', backgroundColor: '#ffffff', color: '#334155' }}>
            <style>
                {`
                    .minimal-plus h1, .minimal-plus h2, .minimal-plus h3, .minimal-plus h4 {
                        font-family: inherit;
                    }
                    .minimal-plus .section-title {
                        font-size: 1.35rem;
                        color: #334155;
                        text-transform: uppercase;
                        font-weight: 700;
                        margin-bottom: 12px;
                        border-bottom: 2px solid #e2e8f0;
                        padding-bottom: 4px;
                        letter-spacing: 0.5px;
                    }
                    .minimal-plus .job-title {
                        font-size: 1.25rem;
                        color: #0284c7; /* A nice ocean blue */
                        font-weight: 600;
                        margin: 0;
                    }
                    .minimal-plus .company-name {
                        font-size: 1.25rem;
                        color: #64748b;
                        font-weight: 500;
                    }
                    .minimal-plus .date-range {
                        font-size: 0.75rem;
                        color: #94a3b8;
                        text-transform: uppercase;
                        margin-top: 2px;
                        margin-bottom: 6px;
                        display: block;
                    }
                    .minimal-plus .description-text p {
                        margin: 0 0 8px 0;
                        font-size: 0.95rem;
                        line-height: 1.45;
                    }
                    .minimal-plus .description-text ul {
                        margin: 0 0 10px 0;
                        padding-left: 20px;
                    }
                    .minimal-plus .description-text li {
                        margin-bottom: 4px;
                        font-size: 0.95rem;
                        line-height: 1.45;
                    }
                    .minimal-plus .description-text {
                        word-break: break-word;
                        overflow-wrap: break-word;
                    }
                    /* Styling the 'highlight' look from the image */
                    .minimal-plus mark {
                        background-color: #dcfce7 !important; /* light green */
                        color: #166534 !important;
                        padding: 0 4px;
                        border-radius: 4px;
                        font-weight: 500;
                    }
                `}
            </style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', margin: 0, letterSpacing: '1px' }}>
                        {personalInfo.fullName || 'TU NOMBRE AQUÍ'}
                    </h1>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {personalInfo.email && <div><strong>Email:</strong> {personalInfo.email}</div>}
                    {personalInfo.phone && <div><strong>Teléfono:</strong> {personalInfo.phone}</div>}
                    {personalInfo.address && <div><strong>Ubicación:</strong> {personalInfo.address}</div>}
                    {personalInfo.website && <div><strong>Portfolio:</strong> {personalInfo.website}</div>}
                </div>
                {personalInfo.photo && (
                    <div style={{ marginLeft: '15px' }}>
                        <img
                            src={personalInfo.photo}
                            alt="Foto de perfil"
                            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                )}
            </div>

            {/* Summary */}
            {personalInfo.summary && (
                <div style={{ marginBottom: '25px' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                        {personalInfo.summary}
                    </p>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                    <h2 className="section-title">Experiencia Relevante</h2>
                    {experience.map(exp => (
                        <div key={exp.id} style={{ marginBottom: '18px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                                <h3 className="job-title">{exp.position}</h3>
                                {exp.company && <span className="company-name">| {exp.company}</span>}
                            </div>
                            <span className="date-range">
                                {exp.showDuration ? calculateDuration(exp.startDate, exp.endDate) : formatPeriod(exp.startDate, exp.endDate)}
                            </span>
                            <div
                                className="description-text"
                                dangerouslySetInnerHTML={{ __html: exp.description }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                    <h2 className="section-title">Formación Académica</h2>
                    {education.map(edu => (
                        <div key={edu.id} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 className="job-title" style={{ fontSize: '1.1rem', color: '#334155' }}>{edu.degree}</h3>
                                <span className="date-range" style={{ margin: 0, fontWeight: 500 }}>{edu.year}</span>
                            </div>
                            <h4 className="company-name" style={{ fontSize: '0.95rem', margin: '2px 0 0 0' }}>{edu.institution}</h4>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Row: Skills & QR (as 'Proyectos' or extra info) */}
            <div style={{ display: 'flex', gap: '30px', marginTop: 'auto' }}>
                {skills && skills.length > 0 && (
                    <div style={{ flex: 1 }}>
                        <h2 className="section-title" style={{ fontSize: '1.1rem' }}>Aptitudes</h2>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                            {/* Grouping skills visually as comma separated per line for compactness, or just bullet points */}
                            <li style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                                • {skills.map(s => s.name).join(', ')}
                            </li>
                        </ul>
                    </div>
                )}

                {personalInfo.showQrCode && personalInfo.website && (
                    <div style={{ flexShrink: 0, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <QRCodeSVG value={personalInfo.website} size={70} level="M" style={{ marginBottom: '8px' }} />
                        {(!personalInfo.qrCodeType || personalInfo.qrCodeType === 'link') && <Globe size={18} color="#64748b" />}
                        {personalInfo.qrCodeType === 'github' && <Github size={18} color="#64748b" />}
                        {personalInfo.qrCodeType === 'linkedin' && <Linkedin size={18} color="#64748b" />}
                    </div>
                )}
            </div>

        </div>
    );
};

export default MinimalPlusTemplate;
