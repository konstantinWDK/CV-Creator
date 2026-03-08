import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Download, Save, Plus, Trash2, User, Briefcase, GraduationCap, Code, Linkedin, Github, Settings, Eye, EyeOff, X, LogOut } from 'lucide-react';
import { getSavedCVs, saveCV, deleteCV, getDefaultCV, getSampleCV, exportAllData, importData } from './utils/storage';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import CVCompletionBar from './components/CVCompletionBar';
import AuthModal from './components/auth/AuthModal';
import LandingPage from './components/LandingPage';
import { useAuth } from './context/AuthContext';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

const CVCreator = () => {
  const { t, i18n } = useTranslation();
  const [cvs, setCvs] = useState([]);
  const [currentCV, setCurrentCV] = useState(getDefaultCV());
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showSaveStatus, setShowSaveStatus] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const { user, token, logout, isAuthenticated } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.cv-creator.webdesignerk.com';
  const [searchParams] = useSearchParams();

  // Load demo template from URL params (e.g. /app?demo=true&template=modern)
  const isDemoFromUrl = searchParams.get('demo') === 'true';

  useEffect(() => {
    const templateParam = searchParams.get('template');
    const validTemplates = ['minimal', 'modern', 'minimal-plus', 'professional', 'classic'];
    if (isDemoFromUrl) {
      const sample = getSampleCV();
      if (templateParam && validTemplates.includes(templateParam)) {
        sample.templateId = templateParam;
      }
      setCurrentCV(sample);
      // En dispositivos móviles, mostrar preview automáticamente
      // En desktop, el preview siempre está visible
      if (window.innerWidth <= 768) {
        setShowMobilePreview(true);
      }
    }
  }, [searchParams, isDemoFromUrl]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    // Si venimos de un demo, no cargar datos guardados para no sobrescribir
    if (isDemoFromUrl) return;

    const loadData = async () => {
      if (isAuthenticated && token) {
        setLoadingContent(true);
        try {
          const response = await fetch(`${API_URL}/api/cvs`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok && Array.isArray(data)) {
            // Map content and handle potential stringified JSON
            const mappedCvs = data.map(dbCv => {
              let content = dbCv.content;
              if (typeof content === 'string') {
                try { content = JSON.parse(content); } catch (e) { content = {}; }
              }
              return {
                ...content,
                id: dbCv.id,
                dbId: dbCv.id
              };
            });

            setCvs(mappedCvs);

            if (mappedCvs.length > 0) {
              setCurrentCV(mappedCvs[0]);
            } else {
              // Account is empty, check if we have guest data to migrate
              const guestCVs = getSavedCVs();
              if (guestCVs.length > 0) {
                // Migrate the first guest CV automatically
                const guestToMigrate = guestCVs[0];
                const saveRes = await fetch(`${API_URL}/api/cvs`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    name: guestToMigrate.personalInfo?.fullName || t('settings.cvUntitled'),
                    content: { ...guestToMigrate, id: undefined, dbId: undefined }
                  })
                });

                if (saveRes.ok) {
                  const resJson = await saveRes.json();
                  const migrated = { ...guestToMigrate, id: resJson.cvId, dbId: resJson.cvId };
                  setCvs([migrated]);
                  setCurrentCV(migrated);
                } else {
                  setCurrentCV(getDefaultCV());
                }
              } else {
                setCurrentCV(getDefaultCV());
              }
            }
          } else {
            // If data is not an array or response not OK
            setCvs([]);
            setCurrentCV(getDefaultCV());
          }
        } catch (error) {
          console.error('Error fetching CVs:', error);
          setCurrentCV(getDefaultCV());
        } finally {
          setLoadingContent(false);
        }
      } else if (!isAuthenticated) {
        const loadedCVs = getSavedCVs();
        setCvs(loadedCVs);
        if (loadedCVs.length > 0) {
          setCurrentCV(loadedCVs[0]);
        } else {
          setCurrentCV(getDefaultCV());
        }
      }
    };
    loadData();
  }, [isAuthenticated, token, isDemoFromUrl, t, API_URL]);

  // Debounced Auto-save (Guest mode only)
  useEffect(() => {
    if (!currentCV.id || isAuthenticated) return;

    const timer = setTimeout(() => {
      saveCV(currentCV);
      setCvs(getSavedCVs());
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentCV, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      // Guest user: save to localStorage
      saveCV(currentCV);
      setCvs(getSavedCVs());
      setShowSaveStatus(true);
      return;
    }

    // Authenticated user: sync to cloud
    try {
      const response = await fetch(`${API_URL}/api/cvs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: currentCV.dbId || (typeof currentCV.id === 'number' ? currentCV.id : null),
          name: currentCV.personalInfo?.fullName || t('settings.cvUntitled'),
          content: { ...currentCV, id: undefined, dbId: undefined }
        })
      });

      const resData = await response.json();
      if (response.ok) {
        setShowSaveStatus(true);
        // Refresh list
        const refreshRes = await fetch(`${API_URL}/api/cvs`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await refreshRes.json();
        const mappedCvs = data.map(dbCv => ({
          ...dbCv.content,
          id: dbCv.id,
          dbId: dbCv.id
        }));
        setCvs(mappedCvs);

        // Update current CV with the returned DB ID if it's new
        if (!currentCV.dbId) {
          const savedCV = mappedCvs.find(c => c.id === resData.cvId);
          if (savedCV) setCurrentCV(savedCV);
        }
      }
    } catch (error) {
      console.error('Error saving CV:', error);
    }
  };

  // Auto-hide Save Notification after 3s
  useEffect(() => {
    let timeout;
    if (showSaveStatus) {
      timeout = setTimeout(() => {
        setShowSaveStatus(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showSaveStatus]);

  const handleCreateNew = () => {
    const newCV = getDefaultCV();
    setCurrentCV(newCV);
  };

  const [sampleIndex, setSampleIndex] = useState(1);
  const handleLoadSample = () => {
    // Alternate between the two samples
    const sample = sampleIndex === 1 ? getSampleCV() : getSampleCV2();
    setCurrentCV(sample);
    setSampleIndex(sampleIndex === 1 ? 2 : 1);
  };

  const handleExport = () => {
    exportAllData();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = importData(content);
      if (success) {
        const updatedCVs = getSavedCVs();
        setCvs(updatedCVs);
        if (updatedCVs.length > 0) {
          setCurrentCV(updatedCVs[0]);
        }
        alert(t('app.importSuccess'));
      } else {
        alert(t('app.importError'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDelete = async (id) => {
    const idToDelete = currentCV.dbId || id;
    if (isAuthenticated) {
      try {
        await fetch(`${API_URL}/api/cvs/${idToDelete}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const updated = cvs.filter(c => (c.dbId || c.id) !== idToDelete);
        setCvs(updated);
        if ((currentCV.dbId || currentCV.id) === idToDelete) {
          setCurrentCV(updated.length > 0 ? updated[0] : getDefaultCV());
        }
      } catch (error) {
        console.error('Error deleting CV:', error);
      }
    } else {
      deleteCV(idToDelete);
      const updated = getSavedCVs();
      setCvs(updated);
      if (currentCV.id === idToDelete) {
        setCurrentCV(updated.length > 0 ? updated[0] : getDefaultCV());
      }
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-preview-content');
    const opt = {
      margin: 0,
      filename: `${currentCV.personalInfo?.fullName || t('settings.cvUntitled')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, windowWidth: 800 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container minimal-theme">
      {/* Primary Sidebar - Fixed on the left */}
      <aside className="primary-sidebar">
        <div className="nav-top">
          <div className="brand" title={t('app.title')}>{t('app.brand')}</div>

          <button className={`nav-icon ${activeTab === 'personalInfo' ? 'active' : ''}`} onClick={() => setActiveTab('personalInfo')} title={t('app.personalInfo')}>
            <User size={24} />
            <span className="nav-label">{t('app.personalInfo')}</span>
            {activeTab === 'personalInfo' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')} title={t('app.experience')}>
            <Briefcase size={24} />
            <span className="nav-label">{t('app.experience')}</span>
            {activeTab === 'experience' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')} title={t('app.education')}>
            <GraduationCap size={24} />
            <span className="nav-label">{t('app.education')}</span>
            {activeTab === 'education' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')} title={t('app.skills')}>
            <Code size={24} />
            <span className="nav-label">{t('app.skills')}</span>
            {activeTab === 'skills' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title={t('app.settings')}>
            <Settings size={24} />
            <span className="nav-label">{t('app.settings')}</span>
            {activeTab === 'settings' && <span className="active-indicator"></span>}
          </button>
        </div>

        <div className="nav-bottom">
          <a
            href="https://www.linkedin.com/jobs/application-settings/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon action"
            title={t('app.uploadLinkedin')}
            style={{ color: '#0a66c2' }}
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://github.com/konstantinWDK/CV-Creator"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon action"
            title={t('app.viewGithub')}
            style={{ color: '#94a3b8' }}
          >
            <Github size={24} />
          </a>
        </div>
      </aside>

      <main className="main-layout">
        {/* Floating Controls Top Right */}
        <div className="floating-controls-top">
          <button
            className="lang-toggle-btn"
            onClick={() => changeLanguage(i18n.language === 'es' ? 'en' : 'es')}
            title={t('settings.language')}
          >
            {i18n.language.toUpperCase()}
          </button>

          {isAuthenticated && user ? (
            <div className="auth-profile floating-auth">
              <span className="user-email hide-mobile">{user.email}</span>
              <button className="logout-icon-btn" onClick={logout} title={t('auth.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="login-btn-header floating-auth" onClick={() => setShowAuthModal(true)}>
              <User size={18} />
              <span>{t('auth.loginBtn')}</span>
            </button>
          )}
        </div>

        {/* Desktop Floating Controls Bottom Left (hidden on mobile) */}
        <div className="floating-controls-bottom desktop-only">
          <button className="nav-icon action new" onClick={handleCreateNew} title={t('app.createNew')}>
            <Plus size={20} />
          </button>
          <button className="nav-icon action sample" onClick={handleLoadSample} title={t('app.importDemo')}>
            <Briefcase size={20} />
          </button>
          <button className="nav-icon action save" onClick={handleSave} title={t('app.save')}>
            <Save size={20} />
          </button>
          <button className="nav-icon action pdf" onClick={handleDownloadPDF} title={t('app.downloadPdf')}>
            <Download size={20} />
          </button>
          {cvs.some(c => c.id === currentCV.id) && (
            <button className="nav-icon action danger" onClick={() => handleDelete(currentCV.id)} title={t('app.deleteCv')}>
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {/* Mobile Speed Dial FAB - Bottom Right */}
        <div className={`mobile-fab-container${showFab ? ' fab-open' : ''}`}>
          {/* Action items - expand to the left */}
          <div className="fab-actions">
            <button className="fab-action new" onClick={() => { handleCreateNew(); setShowFab(false); }} title={t('app.createNew')}>
              <Plus size={18} />
            </button>
            <button className="fab-action save" onClick={() => { handleSave(); setShowFab(false); }} title={t('app.save')}>
              <Save size={18} />
            </button>
            <button className="fab-action pdf" onClick={() => { handleDownloadPDF(); setShowFab(false); }} title={t('app.downloadPdf')}>
              <Download size={18} />
            </button>
            <button className="fab-action preview" onClick={() => { setShowMobilePreview(true); setShowFab(false); }} title={t('app.viewCv')}>
              <Eye size={18} />
            </button>
            {cvs.some(c => c.id === currentCV.id) && (
              <button className="fab-action danger" onClick={() => { handleDelete(currentCV.id); setShowFab(false); }} title={t('app.deleteCv')}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
          {/* Main FAB toggle button */}
          <button className="fab-main" onClick={() => setShowFab(!showFab)}>
            {showFab ? <X size={24} /> : <Plus size={24} />}
          </button>
        </div>

        {/* Secondary Sidebar (Form Content) */}
        <div className="secondary-sidebar">
          <div className="sidebar-content">
            <CVCompletionBar data={currentCV} />
            {activeTab === 'settings' ? (
              <div className="settings-panel">
                <h2 className="panel-title">{t('settings.title')}</h2>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{t('settings.selectCv')}</label>
                  <select
                    className="cv-selector-minimal"
                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                    value={currentCV.id}
                    onChange={(e) => {
                      const selected = cvs.find(c => c.id === e.target.value);
                      if (selected) setCurrentCV(selected);
                    }}
                  >
                    <option value={currentCV.id} disabled={cvs.some(c => c.id === currentCV.id)}>
                      {cvs.some(c => c.id === currentCV.id) ? currentCV.personalInfo?.fullName || t('settings.cvUntitled') : t('settings.cvNew')}
                    </option>
                    {cvs.map(cv => (
                      <option key={cv.id} value={cv.id}>
                        {cv.personalInfo?.fullName || t('settings.cvUntitled')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{t('settings.templateDesign')}</label>
                  <select
                    className="cv-selector-minimal"
                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                    value={currentCV.templateId || 'minimal'}
                    onChange={(e) => setCurrentCV({ ...currentCV, templateId: e.target.value })}
                  >
                    <option value="minimal">{t('settings.templateMinimal')}</option>
                    <option value="modern">{t('settings.templateModern')}</option>
                    <option value="minimal-plus">{t('settings.templateMinimalPlus')}</option>
                    <option value="professional">{t('settings.templateProfessional')}</option>
                    <option value="classic">{t('settings.templateClassic')}</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{t('settings.globalTypography')}</label>
                  <select
                    className="cv-selector-minimal"
                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                    value={currentCV.fontFamily || 'Inter'}
                    onChange={(e) => setCurrentCV({ ...currentCV, fontFamily: e.target.value })}
                  >
                    <option value="Inter">{t('settings.fontInter')}</option>
                    <option value="Outfit">{t('settings.fontOutfit')}</option>
                    <option value="Roboto">{t('settings.fontRoboto')}</option>
                    <option value="Merriweather">{t('settings.fontMerriweather')}</option>
                    <option value="'Courier Prime', monospace">{t('settings.fontCourier')}</option>
                  </select>
                </div>

                {currentCV.templateId !== 'modern' && (
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>{t('settings.spacing')}</label>
                    <select
                      className="cv-selector-minimal"
                      style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                      value={currentCV.paddingLevel || 'normal'}
                      onChange={(e) => setCurrentCV({ ...currentCV, paddingLevel: e.target.value })}
                    >
                      <option value="compact">{t('settings.spacingCompact')}</option>
                      <option value="medium">{t('settings.spacingMedium')}</option>
                      <option value="normal">{t('settings.spacingNormal')}</option>
                    </select>
                  </div>
                )}

                <div className="settings-divider" style={{ height: '1px', background: '#e2e8f0', margin: '2rem 0 1rem 0' }}></div>

                <div className="backup-section">
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>{t('settings.backup')}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={handleExport}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
                    >
                      <Download size={18} /> {t('settings.exportJson')}
                    </button>
                    <label className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <Plus size={18} /> {t('settings.importJson')}
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                      {t('settings.backupHelp')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <CVForm data={currentCV} onChange={setCurrentCV} activeTab={activeTab} />
            )}
          </div>
        </div>

        {/* Preview Container - Hidden on mobile unless showMobilePreview is true */}
        <div className={`preview-container${showMobilePreview ? ' mobile-preview-open' : ''}`}>
          {loadingContent && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          <button
            className="btn-close-preview"
            onClick={() => setShowMobilePreview(false)}
            title={t('app.closePreview')}
          >
            <X size={22} />
          </button>
          <div className="preview-scaler">
            <CVPreview data={currentCV} />
          </div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} apiUrl={API_URL} />

      {/* Save Notification */}
      <div className={`save-status-indicator ${showSaveStatus ? 'show' : ''}`}>
        <span className="check-icon">✓</span> {t('app.changesSaved')}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<CVCreator />} />
        {/* Redirect any other route to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
