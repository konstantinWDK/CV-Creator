import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPeriod, calculateDuration } from '../../utils/formatDate';

const ModernTemplate = ({ data }) => {
    const { personalInfo, experience, education, skills } = data;

    return (
        <div className="a4-page" id="cv-preview-content" style={{ padding: 0, display: 'flex', flexDirection: 'row', minHeight: '297mm' }}>
            {/* Left Sidebar Profile Section */}
            <div style={{ width: '35%', backgroundColor: '#0f172a', color: '#f8fafc', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ textAlign: 'center' }}>
                    {personalInfo.photo ? (
                        <img
                            src={personalInfo.photo}
                            alt="Profile"
                            style={{ width: '140px', height: '140px', objectFit: 'cover', borderRadius: '50%', border: '4px solid #ffffff', marginBottom: '15px' }}
                        />
                    ) : (
                        <div style={{ width: '140px', height: '140px', borderRadius: '50%', backgroundColor: '#334155', margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#f8fafc' }}>
                            {personalInfo.fullName ? personalInfo.fullName.charAt(0).toUpperCase() : '?'}
                        </div>
                    )}
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 5px 0', lineHeight: 1.2 }}>{personalInfo.fullName || 'Tu Nombre'}</h1>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px', color: '#cbd5e1' }}>Contacto</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                        {personalInfo.email && <span style={{ wordBreak: 'break-all' }}>📍 {personalInfo.email}</span>}
                        {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                        {personalInfo.address && <span>🏠 {personalInfo.address}</span>}
                        {personalInfo.website && <span style={{ color: '#ea580c', wordBreak: 'break-all' }}>🔗 {personalInfo.website}</span>}
                    </div>
                </div>

                {skills && skills.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px', color: '#cbd5e1' }}>Habilidades</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {skills.map(skill => (
                                <span key={skill.id} style={{ background: '#334155', color: '#f8fafc', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {personalInfo.showQrCode && personalInfo.website && (
                    <div style={{ marginTop: 'auto', alignSelf: 'center', background: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                        <QRCodeSVG value={personalInfo.website} size={90} level="M" />
                        <p style={{ fontSize: '0.7rem', color: '#0f172a', margin: '5px 0 0 0', fontWeight: 'bold', textAlign: 'center' }}>ESCANEAR</p>
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div style={{ width: '65%', backgroundColor: '#ffffff', padding: '40px 30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {personalInfo.summary && (
                    <div style={{ paddingBottom: '20px', borderBottom: '2px solid #ea580c' }}>
                        <h2 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 800 }}>Perfil Profesional</h2>
                        <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.95rem' }}>{personalInfo.summary}</p>
                    </div>
                )}

                {experience && experience.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.6rem', color: '#ea580c', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 800 }}>Experiencia</h2>
                        {experience.map((exp, idx) => (
                            <div key={exp.id} style={{ marginBottom: idx === experience.length - 1 ? '0' : '25px', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                                    <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                                        {exp.position}
                                    </h3>
                                    <span style={{ color: '#ea580c', fontSize: '0.85rem', fontWeight: 600, background: '#fff7ed', padding: '4px 8px', borderRadius: '4px' }}>
                                        {exp.showDuration ? calculateDuration(exp.startDate, exp.endDate) : formatPeriod(exp.startDate, exp.endDate)}
                                    </span>
                                </div>
                                {exp.company && <h4 style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 8px 0', fontWeight: 600 }}>{exp.company}</h4>}
                                <p style={{
                                    color: '#334155',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6,
                                    margin: 0,
                                    wordBreak: 'break-word',
                                    overflowWrap: 'break-word'
                                }} dangerouslySetInnerHTML={{ __html: exp.description }} />
                            </div>
                        ))}
                    </div>
                )}

                {education && education.length > 0 && (
                    <div>
                        <h2 style={{ fontSize: '1.6rem', color: '#ea580c', marginBottom: '20px', textTransform: 'uppercase', fontWeight: 800 }}>Educación</h2>
                        {education.map(edu => (
                            <div key={edu.id} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0, fontWeight: 700 }}>{edu.degree}</h3>
                                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{edu.year}</span>
                                </div>
                                <h4 style={{ fontSize: '0.95rem', color: '#64748b', margin: '5px 0 0 0' }}>{edu.institution}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernTemplate;
