import { useState, useEffect } from 'react';
import { Download, Save, Plus, Trash2, User, Briefcase, GraduationCap, Code, Linkedin, Github, Settings, Eye, EyeOff, X, LogOut } from 'lucide-react';
import { getSavedCVs, saveCV, deleteCV, getDefaultCV, getSampleCV, exportAllData, importData } from './utils/storage';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import AuthModal from './components/auth/AuthModal';
import { useAuth } from './context/AuthContext';
import html2pdf from 'html2pdf.js';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [cvs, setCvs] = useState([]);
  const [currentCV, setCurrentCV] = useState(getDefaultCV());
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showSaveStatus, setShowSaveStatus] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, token, logout, isAuthenticated } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.cv-creator.webdesignerk.com';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && token) {
        try {
          const response = await fetch(`${API_URL}/api/cvs`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            // Map content to include the DB id top-level for easier tracking
            const mappedCvs = data.map(dbCv => ({
              ...dbCv.content,
              id: dbCv.id, // Use DB numeric ID
              dbId: dbCv.id // Keep reference
            }));
            setCvs(mappedCvs);

            if (mappedCvs.length > 0) {
              setCurrentCV(mappedCvs[0]);
            } else {
              // Start with a blank CV
              setCurrentCV(getDefaultCV());
            }
          }
        } catch (error) {
          console.error('Error fetching CVs:', error);
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
  }, [isAuthenticated, token]);

  // Debounced Auto-save (Guest mode only)
  useEffect(() => {
    if (!currentCV.id || isAuthenticated) return;

    const timer = setTimeout(() => {
      saveCV(currentCV);
      setCvs(getSavedCVs());
      setShowSaveStatus(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentCV, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

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
            {activeTab === 'personalInfo' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')} title={t('app.experience')}>
            <Briefcase size={24} />
            {activeTab === 'experience' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')} title={t('app.education')}>
            <GraduationCap size={24} />
            {activeTab === 'education' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')} title={t('app.skills')}>
            <Code size={24} />
            {activeTab === 'skills' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title={t('app.settings')}>
            <Settings size={24} />
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

        {/* Floating Controls Bottom Left */}
        <div className="floating-controls-bottom">
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

        {/* Secondary Sidebar (Form Content) */}
        <div className="secondary-sidebar">
          <div className="sidebar-content">
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
}

export default App;
