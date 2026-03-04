import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatPeriod, calculateDuration } from '../../utils/formatDate';

const ClassicTemplate = ({ data }) => {
    const { personalInfo, experience, education, skills } = data;

    // Helper to format contact info into a single line joined by dots •
    const renderContactLine = () => {
        const parts = [];
        if (personalInfo.phone) parts.push(personalInfo.phone);
        if (personalInfo.email) parts.push(personalInfo.email);
        if (personalInfo.website) parts.push(personalInfo.website.replace(/^https?:\/\//, ''));
        if (personalInfo.address) parts.push(personalInfo.address);

        return parts.join(' • ');
    };

    return (
        <div className="a4-page classic-template" id="cv-preview-content" style={{ padding: '15mm 18mm', backgroundColor: '#ffffff', color: '#1a1a1a' }}>
            <style>
                {`
                    .classic-template * {
                        box-sizing: border-box;
                    }
                    .classic-template h1, .classic-template h2, .classic-template h3, .classic-template h4, .classic-template p {
                        margin: 0;
                    }
                    
                    /* Serif / Formal adjustments */
                    .classic-template {
                        /* Force a serif default if the user hasn't explicitly set one, but App.jsx drives the main font */
                        font-size: 0.95rem;
                        line-height: 1.5;
                    }

                    /* Header Area */
                    .classic-template .header-wrapper {
                        text-align: center;
                        margin-bottom: 25px;
                    }
                    .classic-template .main-name {
                        font-size: 2.2rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #000000;
                        margin-bottom: 8px;
                    }
                    .classic-template .current-title {
                        font-size: 1.1rem;
                        color: #4b5563;
                        margin-bottom: 6px;
                    }
                    .classic-template .contact-line {
                        font-size: 0.85rem;
                        color: #111827;
                        letter-spacing: 0.5px;
                    }

                    /* Section Titles */
                    .classic-template .section-title-wrapper {
                        text-align: center;
                        border-top: 1px solid #000;
                        border-bottom: 1px solid #000;
                        padding: 6px 0;
                        margin: 20px 0 15px 0;
                    }
                    .classic-template .section-title {
                        font-size: 1.15rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #000000;
                    }

                    /* List Items (Experience / Education) */
                    .classic-template .list-item {
                        margin-bottom: 18px;
                    }
                    .classic-template .item-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: baseline;
                        margin-bottom: 2px;
                    }
                    .classic-template .institution-name {
                        font-size: 1.05rem;
                        font-weight: 600;
                        color: #111827;
                    }
                    .classic-template .item-location {
                        font-size: 0.9rem;
                        color: #374151;
                    }
                    
                    .classic-template .role-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: baseline;
                        margin-bottom: 6px;
                    }
                    .classic-template .role-title {
                        font-size: 0.95rem;
                        font-style: italic;
                        color: #374151;
                    }
                    .classic-template .item-dates {
                        font-size: 0.9rem;
                        color: #4b5563;
                    }
                    
                    /* Description Content */
                    .classic-template .description-text {
                        font-size: 0.9rem;
                        line-height: 1.5;
                        color: #111827;
                        word-break: break-word;
                        overflow-wrap: break-word;
                    }
                    .classic-template .description-text p {
                        margin-bottom: 8px;
                        text-align: justify;
                    }
                    .classic-template .description-text ul {
                        margin: 0 0 8px 0;
                        padding-left: 18px;
                    }
                    .classic-template .description-text li {
                        margin-bottom: 4px;
                    }
                    
                    /* Skills */
                    .classic-template .skills-inline {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        gap: 8px;
                        font-size: 0.95rem;
                        text-align: center;
                    }
                    .classic-template .skill-item {
                        color: #111827;
                    }
                    .classic-template .skill-separator {
                        color: #9ca3af;
                        margin: 0 4px;
                    }

                    /* Summary */
                    .classic-template .summary-text {
                        font-size: 0.95rem;
                        line-height: 1.5;
                        color: #111827;
                        text-align: justify;
                    }

                    /* QR Code Area */
                    .classic-template .qr-container {
                        display: flex;
                        justify-content: center;
                        margin-top: 30px;
                    }
                    .classic-template .qr-box {
                        display: inline-flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 10px;
                        border: 1px solid #e5e7eb;
                        background: #f9fafb;
                    }
                `}
            </style>

            {/* Header */}
            <div className="header-wrapper">
                <h1 className="main-name">{personalInfo.fullName || 'NOMBRE APELIDOS'}</h1>

                {/* Optional: if there was a specific 'title' field, it would go here. We'll use the summary's first short sentence if available, or just skip it. */}

                <div className="contact-line">
                    {renderContactLine()}
                </div>
            </div>

            {/* Professional Summary */}
            {personalInfo.summary && (
                <div>
                    <div className="section-title-wrapper">
                        <h2 className="section-title">Perfil Profesional</h2>
                    </div>
                    <div className="summary-text" dangerouslySetInnerHTML={{ __html: personalInfo.summary.replace(/\n/g, '<br />') }} />
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div>
                    <div className="section-title-wrapper">
                        <h2 className="section-title">Experiencia</h2>
                    </div>
                    <div>
                        {experience.map(exp => (
                            <div key={exp.id} className="list-item">
                                <div className="item-header">
                                    <h3 className="institution-name">{exp.company || 'Empresa'}</h3>
                                    {/* Usually location goes here in classic templates, but we don't have location field in exp. Let's put a placeholder or omit.*/}
                                </div>
                                <div className="role-row">
                                    <h4 className="role-title">{exp.position}</h4>
                                    <span className="item-dates">
                                        {exp.showDuration ? calculateDuration(exp.startDate, exp.endDate) : formatPeriod(exp.startDate, exp.endDate)}
                                    </span>
                                </div>
                                <div
                                    className="description-text"
                                    dangerouslySetInnerHTML={{ __html: exp.description }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div>
                    <div className="section-title-wrapper">
                        <h2 className="section-title">Educación</h2>
                    </div>
                    <div>
                        {education.map(edu => (
                            <div key={edu.id} className="list-item" style={{ marginBottom: '12px' }}>
                                <div className="item-header">
                                    <h3 className="institution-name">{edu.institution}</h3>
                                </div>
                                <div className="role-row">
                                    <h4 className="role-title">{edu.degree}</h4>
                                    <span className="item-dates">{edu.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills (Inline Format) */}
            {skills && skills.length > 0 && (
                <div>
                    <div className="section-title-wrapper">
                        <h2 className="section-title">Habilidades</h2>
                    </div>
                    <div className="skills-inline">
                        {skills.map((skill, index) => (
                            <React.Fragment key={skill.id}>
                                <span className="skill-item">{skill.name}</span>
                                {index < skills.length - 1 && <span className="skill-separator">•</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* QR Code */}
            {personalInfo.showQrCode && personalInfo.website && (
                <div className="qr-container">
                    <div className="qr-box">
                        <QRCodeSVG value={personalInfo.website} size={70} level="M" style={{ marginBottom: '8px' }} />
                        <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Escanear Perfil
                        </span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClassicTemplate;
