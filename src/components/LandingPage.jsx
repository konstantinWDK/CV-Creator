import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    Sparkles,
    Download,
    Globe,
    ArrowRight,
    Eye,
    CheckCircle,
    Languages,
    ShieldCheck,
    Code,
    Github,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import MinimalTemplate from './templates/MinimalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalPlusTemplate from './templates/MinimalPlusTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import './LandingPage.css';

const LandingPage = () => {
    const { t, i18n } = useTranslation();
    const [currentTemplate, setCurrentTemplate] = useState(0);

    useEffect(() => {
        // Dynamic SEO Metadata
        document.title = t('landing.metaTitle');
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', t('landing.metaDescription'));
        }
    }, [t]);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(nextLang);
    };

    // Datos de ejemplo sincronizados con getSampleCV() de la app
    const demoData = {
        templateId: 'minimal',
        fontFamily: 'Inter',
        personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 555 123 4567',
            address: 'New York, USA',
            website: 'https://github.com/johndoe',
            photo: null,
            showQrCode: true,
            qrCodeType: 'github',
            summary: 'Senior Full Stack Developer with over 8 years of experience building scalable web applications. Passionate about clean code, modern architectures, and minimalist UI.',
        },
        experience: [
            {
                id: 'demo-exp-1',
                company: 'Tech Solutions Inc.',
                position: 'Senior Web Developer',
                startDate: '2021-01',
                endDate: '',
                isCurrent: true,
                showDuration: false,
                description: 'Leading frontend development using <mark>React</mark> and <span style="color:#ea580c">Node.js</span>. Improved rendering performance by 40%.'
            },
            {
                id: 'demo-exp-2',
                company: 'Digital Creative Agency',
                position: 'Frontend Developer',
                startDate: '2018-03',
                endDate: '2020-12',
                isCurrent: false,
                showDuration: false,
                description: 'Building engaging user interfaces. Integrating with REST APIs. Working under Agile methodologies.'
            }
        ],
        education: [
            {
                id: 'demo-edu-1',
                institution: 'MIT University',
                degree: 'Computer Science Degree',
                year: '2014 - 2018'
            }
        ],
        skills: [
            { id: 'demo-skill-1', name: 'JavaScript' },
            { id: 'demo-skill-2', name: 'React' },
            { id: 'demo-skill-3', name: 'Node.js' },
            { id: 'demo-skill-4', name: 'Tailwind CSS' },
            { id: 'demo-skill-5', name: 'UI/UX Design' },
        ],
    };

    const templates = [
        { id: 'minimal', label: t('landing.templateMinimal'), component: MinimalTemplate },
        { id: 'modern', label: t('landing.templateModern'), component: ModernTemplate },
        { id: 'minimal-plus', label: t('landing.templateMinimalPlus'), component: MinimalPlusTemplate },
        { id: 'professional', label: t('landing.templateProfessional'), component: ProfessionalTemplate },
        { id: 'classic', label: t('landing.templateClassic'), component: ClassicTemplate },
    ];

    const getCurrentTemplateData = () => ({
        ...demoData,
        templateId: templates[currentTemplate].id,
        fontFamily: templates[currentTemplate].id === 'modern' ? 'Outfit' : 'Inter'
    });

    const CurrentTemplateComponent = templates[currentTemplate].component;

    const features = [
        {
            icon: <Sparkles size={24} />,
            title: t('landing.feature1Title'),
            desc: t('landing.feature1Desc')
        },
        {
            icon: <Download size={24} />,
            title: t('landing.feature2Title'),
            desc: t('landing.feature2Desc')
        },
        {
            icon: <ShieldCheck size={24} />,
            title: t('landing.feature3Title'),
            desc: t('landing.feature3Desc')
        }
    ];

    const nextTemplate = () => {
        setCurrentTemplate((prev) => (prev + 1) % templates.length);
    };

    const prevTemplate = () => {
        setCurrentTemplate((prev) => (prev - 1 + templates.length) % templates.length);
    };

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="nav-logo">
                    <img src="/assets/brand-logo.png" alt="WebDesignerk" className="brand-logo-img" />
                    <div className="logo-stack">
                        <span className="logo-cv">CV</span>
                        <span className="logo-creator">Creator</span>
                    </div>
                </div>
                <div className="nav-links">
                    <a href="https://github.com/konstantinWDK/CV-Creator" target="_blank" rel="noopener noreferrer" className="nav-github-link">
                        <Github size={18} /> GitHub
                    </a>
                    <button onClick={toggleLanguage} className="lang-toggle-btn">
                        {i18n.language === 'es' ? 'EN' : 'ES'}
                    </button>
                    <Link to="/app" className="nav-cta">{t('landing.startNow')}</Link>
                </div>
            </nav>

            <header className="hero">
                <div className="hero-content">
                    <div className="hero-badge">{t('landing.noPayments')}</div>
                    <h1>
                        <span className="text-gradient">{t('landing.heroTitle1')}</span><br />
                        {t('landing.heroTitle2')} {t('landing.heroTitle3')}
                    </h1>
                    <p>{t('landing.heroSubtitle')}</p>
                    <div className="hero-actions">
                        <Link to="/app" className="cta-primary">
                            {t('landing.startNow')} <ArrowRight size={20} />
                        </Link>
                        <a href="#features" className="cta-secondary">{t('landing.viewFeatures')}</a>
                    </div>
                </div>
                <div className="hero-image">
                    <img
                        src="/assets/hero-ui.png"
                        alt="CV Creator Interface - Professional Resume Builder"
                        className="main-mockup"
                    />
                </div>
            </header>

            {/* Templates Showcase Slider - Layout 1 columna */}
            <section className="templates-section" id="plantillas">
                {/* Info arriba */}
                <div className="templates-info-header">
                    <div className="info-badge">✨ {t('landing.templatesTitle')}</div>
                    <h2>{t('landing.templatesSubtitle')}</h2>
                    <p>
                        {i18n.language === 'es' 
                            ? 'Elige entre nuestra colección de plantillas profesionales, diseñadas para destacar tu experiencia y habilidades. Cada plantilla es totalmente personalizable y optimizada para ATS.'
                            : 'Choose from our collection of professional templates, designed to highlight your experience and skills. Each template is fully customizable and ATS-optimized.'}
                    </p>
                </div>

                {/* Slider abajo */}
                <div className="slider-wrapper">
                    <div className="template-slider">
                        <Link
                            to={`/app?demo=true&template=${templates[currentTemplate].id}`}
                            className="template-slide"
                        >
                            <div className="template-preview-wrapper">
                                <CurrentTemplateComponent data={getCurrentTemplateData()} />
                            </div>
                            <div className="template-slide-overlay">
                                <span>{t('landing.templateTry')} →</span>
                            </div>
                        </Link>
                        
                        {/* Controles del slider */}
                        <button className="slider-btn slider-btn-prev" onClick={prevTemplate} aria-label="Previous template">
                            <ChevronLeft size={28} />
                        </button>
                        <button className="slider-btn slider-btn-next" onClick={nextTemplate} aria-label="Next template">
                            <ChevronRight size={28} />
                        </button>
                        
                        {/* Indicadores de puntos */}
                        <div className="slider-dots">
                            {templates.map((_, index) => (
                                <button
                                    key={index}
                                    className={`slider-dot ${index === currentTemplate ? 'active' : ''}`}
                                    onClick={() => setCurrentTemplate(index)}
                                    aria-label={`Go to template ${index + 1}`}
                                />
                            ))}
                        </div>
                        
                        {/* Nombre de la plantilla actual */}
                        <div className="template-name-badge">
                            {templates[currentTemplate].label}
                        </div>
                    </div>
                </div>

                {/* Features debajo del slider */}
                <div className="info-features-grid">
                    <div className="info-feature-item">
                        <CheckCircle size={20} className="info-icon" />
                        <span>{i18n.language === 'es' ? 'Diseños modernos y profesionales' : 'Modern and professional designs'}</span>
                    </div>
                    <div className="info-feature-item">
                        <CheckCircle size={20} className="info-icon" />
                        <span>{i18n.language === 'es' ? 'Optimizado para sistemas ATS' : 'ATS-optimized systems'}</span>
                    </div>
                    <div className="info-feature-item">
                        <CheckCircle size={20} className="info-icon" />
                        <span>{i18n.language === 'es' ? 'Totalmente personalizables' : 'Fully customizable'}</span>
                    </div>
                    <div className="info-feature-item">
                        <CheckCircle size={20} className="info-icon" />
                        <span>{i18n.language === 'es' ? 'Exportación en PDF de alta calidad' : 'High-quality PDF export'}</span>
                    </div>
                </div>

                <Link to="/app" className="templates-cta">
                    {t('landing.startNow')} <ArrowRight size={20} />
                </Link>
            </section>

            <section id="features" className="features-section">
                <div className="section-header">
                    <h2>{t('landing.viewFeatures')}</h2>
                </div>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div className="feature-card" key={index}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="benefit-block alt-bg">
                <div className="benefit-container">
                    <div className="benefit-image">
                        <img
                            src="/assets/benefit-person.png"
                            alt="Professional building his resume easily"
                        />
                    </div>
                    <div className="benefit-text">
                        <h2>{t('landing.noPayments')}</h2>
                        <p>{t('landing.noPaymentsDesc')}</p>
                        <ul className="benefit-list">
                            <li>✓ {t('landing.feature1Title')}</li>
                            <li>✓ {t('landing.feature2Title')}</li>
                            <li>✓ {t('landing.feature3Title')}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="open-source-banner">
                <div className="os-content">
                    <div className="os-text">
                        <div className="os-small-badge">GitHub Open Source</div>
                        <h2>{t('landing.openSource')}</h2>
                        <p>{t('landing.openSourceDesc')}</p>
                        <a href="https://github.com/konstantinWDK/CV-Creator" target="_blank" rel="noopener noreferrer" className="github-btn">
                            <Github size={20} /> {t('landing.viewOnGithub')}
                        </a>
                    </div>
                    <div className="os-image-wrapper">
                        <img
                            src="/assets/open-source.png"
                            alt="Open Source Community & Transparency"
                            className="os-image"
                        />
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="section-header">
                    <h2>{t('landing.howTitle')}</h2>
                </div>
                <div className="steps-container">
                    <div className="step-item">
                        <div className="step-number">1</div>
                        <h3>{t('landing.step1Title')}</h3>
                        <p>{t('landing.step1Desc')}</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">2</div>
                        <h3>{t('landing.step2Title')}</h3>
                        <p>{t('landing.step2Desc')}</p>
                    </div>
                    <div className="step-item">
                        <div className="step-number">3</div>
                        <h3>{t('landing.step3Title')}</h3>
                        <p>{t('landing.step3Desc')}</p>
                    </div>
                </div>
            </section>

            {/* Save & Export Block — Dark ambient card */}
            <section className="save-export-block">
                <div className="save-export-inner">
                    <div className="save-export-image">
                        <img
                            src="/assets/save-export-person.png"
                            alt="Professional saving and exporting her resume"
                        />
                    </div>
                    <div className="save-export-content">
                        <div className="save-export-label">☁️ {i18n.language === 'es' ? 'Tu trabajo, siempre seguro' : 'Your work, always safe'}</div>
                        <h2>{t('landing.saveTitle')}</h2>
                        <p>{t('landing.saveDesc')}</p>
                        <div className="save-pills">
                            <span className="save-pill">✓ {t('landing.savePoint1')}</span>
                            <span className="save-pill">✓ {t('landing.savePoint2')}</span>
                            <span className="save-pill">✓ {t('landing.savePoint3')}</span>
                            <span className="save-pill">✓ {t('landing.savePoint4')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* QR Code Block — Orange accent highlight */}
            <section className="qr-block">
                <div className="qr-inner">
                    <div className="qr-content">
                        <div className="qr-icon-badge">⬛</div>
                        <h2>{t('landing.qrTitle')}</h2>
                        <p>{t('landing.qrDesc')}</p>
                        <div className="qr-points-grid">
                            <div className="qr-point"><span>📎</span>{t('landing.qrPoint1')}</div>
                            <div className="qr-point"><span>📱</span>{t('landing.qrPoint2')}</div>
                            <div className="qr-point"><span>🖨️</span>{t('landing.qrPoint3')}</div>
                            <div className="qr-point"><span>🚀</span>{t('landing.qrPoint4')}</div>
                        </div>
                    </div>
                    <div className="qr-image">
                        <img
                            src="/assets/qr-cv-person.png"
                            alt="Recruiter scanning QR code on a printed resume"
                        />
                    </div>
                </div>
            </section>

            <section className="community-section">
                <div className="community-container">
                    <div className="community-text">
                        <h2>{t('landing.community')}</h2>
                        <p>{t('landing.communityDesc')}</p>
                        <div className="community-cta-wrap">
                            <Link to="/app" className="cta-primary">{t('landing.startNow')}</Link>
                        </div>
                    </div>
                    <div className="community-image">
                        <img
                            src="/assets/community-team.png"
                            alt="Global Professional Community"
                        />
                    </div>
                </div>
            </section>

            <section className="seo-content-block">
                <div className="seo-container">
                    <h3>{t('landing.seoFullTitle')}</h3>
                    <p>{t('landing.seoFullText')}</p>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© {new Date().getFullYear()} {t('app.title')}. {t('landing.heroTitle1')} {t('landing.heroTitle2')}</p>
            </footer>
        </div>
    );
};

export default LandingPage;
