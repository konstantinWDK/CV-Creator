import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, Mail, MapPin, Globe, Github, Linkedin, Calendar } from 'lucide-react';
import { formatPeriod, calculateDuration } from '../../utils/formatDate';
import { useTranslation } from 'react-i18next';

const ProfessionalTemplate = ({ data }) => {
    const { t } = useTranslation();
    const { personalInfo, experience, education, skills } = data;

    return (
        <div className="a4-page professional-template" id="cv-preview-content" style={{ padding: '0', backgroundColor: '#ffffff', color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
            <style>
                {`
                    .professional-template * {
                        box-sizing: border-box;
                    }
                    .professional-template h1, .professional-template h2, .professional-template h3, .professional-template h4, .professional-template p {
                        margin: 0;
                    }
                    
                    /* Header Area - Usa variables de padding */
                    .professional-template .header-wrapper {
                        padding: var(--cv-padding-y, 12mm) var(--cv-padding-x, 15mm) 0mm var(--cv-padding-x, 15mm);
                        margin-bottom: 6mm;
                    }
                    .professional-template .main-name {
                        font-family: inherit;
                        font-size: 2.8rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: -0.5px;
                        color: #000000;
                        margin-bottom: 10px;
                        line-height: 1.1;
                    }
                    .professional-template .contact-row {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px 25px;
                        font-size: 0.85rem;
                        color: #000000;
                        font-weight: 600;
                    }
                    .professional-template .contact-item {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .professional-template .contact-icon {
                        color: #2563eb; /* Primary Blue */
                    }

                    /* Main Layout - Usa variables de padding */
                    .professional-template .content-columns {
                        display: flex;
                        flex: 1;
                        padding: 0 var(--cv-padding-x, 15mm) var(--cv-padding-y, 15mm) var(--cv-padding-x, 15mm);
                        gap: 8mm;
                    }

                    /* Left Column (65%) */
                    .professional-template .left-col {
                        flex: 0 0 62%;
                        max-width: 62%;
                    }
                    .professional-template .left-section-title {
                        font-size: 1.4rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        border-bottom: 2px solid #000;
                        padding-bottom: 4px;
                        margin-bottom: 15px;
                        letter-spacing: 0.5px;
                    }
                    
                    /* Timeline styling */
                    .professional-template .timeline-item {
                        position: relative;
                        padding-left: 18px;
                        margin-bottom: 20px;
                        border-left: 2px solid #e2e8f0; /* Light gray line */
                    }
                    .professional-template .timeline-dot {
                        position: absolute;
                        left: -6px; /* center on the 2px border */
                        top: 6px;
                        width: 10px;
                        height: 10px;
                        background-color: #d1d5db;
                        border-radius: 50%;
                    }

                    .professional-template .job-title {
                        font-size: 1.2rem;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 2px;
                    }
                    .professional-template .company-name {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #2563eb; /* Primary Blue */
                        margin-bottom: 4px;
                    }
                    .professional-template .date-location-row {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        font-size: 0.75rem;
                        color: #4b5563;
                        font-weight: 500;
                        margin-bottom: 8px;
                    }
                    
                    .professional-template .description-text {
                        font-size: 0.85rem;
                        line-height: 1.5;
                        color: #374151;
                        word-break: normal;
                        overflow-wrap: break-word;
                    }
                    .professional-template .description-text p {
                        margin-bottom: 6px;
                    }
                    .professional-template .description-text ul {
                        margin: 0;
                        padding-left: 18px;
                    }
                    .professional-template .description-text li {
                        margin-bottom: 3px;
                    }
                    .professional-template mark, .professional-template span[style*="background"] {
                        background-color: transparent !important;
                        color: #111827 !important;
                        font-weight: 700;
                        padding: 0;
                    } /* Unset minimal-plus mark styles just in case, keep bold */


                    /* Right Column (35%) */
                    .professional-template .right-col {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 25px;
                    }
                    .professional-template .right-section-title {
                        font-size: 1.15rem;
                        font-weight: 800;
                        text-transform: uppercase;
                        border-top: 2px solid #000;
                        border-bottom: 2px solid #000;
                        padding: 6px 0;
                        margin-bottom: 12px;
                        text-align: left;
                        letter-spacing: 0.5px;
                    }
                    
                    .professional-template .summary-text {
                        font-size: 0.85rem;
                        line-height: 1.5;
                        color: #374151;
                        text-align: justify;
                    }

                    .professional-template .skills-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }
                    .professional-template .skill-tag {
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: #1f2937;
                        padding: 4px 0;
                        border-bottom: 1px solid #e5e7eb;
                        margin-right: 12px;
                    }

                    .professional-template .qr-box {
                        margin-top: auto;
                        align-self: flex-start;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background: #f8fafc;
                        padding: 10px;
                        border: 1px dashed #cbd5e1;
                        border-radius: 4px;
                        width: 100%;
                    }
                `}
            </style>

            {/* Top Header */}
            <div className="header-wrapper">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h1 className="main-name">{personalInfo.fullName || t('forms.personalInfo.fullNamePlaceholder')}</h1>

                        <div className="contact-row">
                            {personalInfo.phone && (
                                <div className="contact-item">
                                    <Phone size={14} className="contact-icon" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.address && (
                                <div className="contact-item">
                                    <MapPin size={14} className="contact-icon" />
                                    <span>{personalInfo.address}</span>
                                </div>
                            )}
                            {personalInfo.email && (
                                <div className="contact-item">
                                    <Mail size={14} className="contact-icon" />
                                    <span>{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="contact-item">
                                    <Globe size={14} className="contact-icon" />
                                    <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {personalInfo.photo && (
                        <div style={{ marginLeft: '15px', marginTop: '10px' }}>
                            <img
                                src={personalInfo.photo}
                                alt="Foto"
                                style={{ width: '85px', height: '85px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #e5e7eb' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Split Content Below */}
            <div className="content-columns">

                {/* LEFT COLUMN */}
                <div className="left-col">
                    {/* Experience section */}
                    {experience && experience.length > 0 && (
                        <div style={{ marginBottom: '25px' }}>
                            <h2 className="left-section-title">{t('preview.experience')}</h2>
                            <div style={{ paddingTop: '5px' }}>
                                {experience.map(exp => (
                                    <div key={exp.id} className="timeline-item">
                                        <div className="timeline-dot"></div>
                                        <h3 className="job-title">{exp.position}</h3>
                                        {exp.company && <h4 className="company-name">{exp.company}</h4>}

                                        <div className="date-location-row">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={12} color="#6b7280" />
                                                <span>{exp.showDuration ? calculateDuration(exp.startDate, exp.endDate) : formatPeriod(exp.startDate, exp.endDate)}</span>
                                            </div>
                                            {/* Could add a location field to experience later, hardcoding placeholder or omitting if empty */}
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

                    {/* Education section */}
                    {education && education.length > 0 && (
                        <div>
                            <h2 className="left-section-title">{t('preview.education')}</h2>
                            <div style={{ paddingTop: '5px' }}>
                                {education.map(edu => (
                                    <div key={edu.id} className="timeline-item" style={{ marginBottom: '15px' }}>
                                        <div className="timeline-dot"></div>
                                        <h3 className="job-title">{edu.degree}</h3>
                                        <h4 className="company-name">{edu.institution}</h4>
                                        <div className="date-location-row">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={12} color="#6b7280" />
                                                <span>{edu.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="right-col">
                    {/* Summary */}
                    {personalInfo.summary && (
                        <div>
                            <h2 className="right-section-title">{t('forms.personalInfo.summary')}</h2>
                            <div className="summary-text" dangerouslySetInnerHTML={{ __html: personalInfo.summary.replace(/\n/g, '<br />') }} />
                        </div>
                    )}

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div>
                            <h2 className="right-section-title">{t('preview.skills')}</h2>
                            <div className="skills-grid">
                                {skills.map(skill => (
                                    <span key={skill.id} className="skill-tag">{skill.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* QR Code */}
                    {personalInfo.showQrCode && personalInfo.website && (
                        <div className="qr-box">
                            <QRCodeSVG value={personalInfo.website} size={80} level="M" style={{ marginBottom: '8px' }} />
                            {(!personalInfo.qrCodeType || personalInfo.qrCodeType === 'link') && <Globe size={18} color="#64748b" />}
                            {personalInfo.qrCodeType === 'github' && <Github size={18} color="#64748b" />}
                            {personalInfo.qrCodeType === 'linkedin' && <Linkedin size={18} color="#64748b" />}
                            <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>{t('preview.scanLink')}</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProfessionalTemplate;
