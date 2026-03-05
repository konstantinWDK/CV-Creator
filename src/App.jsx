import { useState, useEffect } from 'react';
import { Download, Save, Plus, Trash2, User, Briefcase, GraduationCap, Code, Linkedin, Github, Settings, Eye, EyeOff, X } from 'lucide-react';
import { getSavedCVs, saveCV, deleteCV, getDefaultCV, getSampleCV } from './utils/storage';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import html2pdf from 'html2pdf.js';

function App() {
  const [cvs, setCvs] = useState([]);
  const [currentCV, setCurrentCV] = useState(getDefaultCV());
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  useEffect(() => {
    const loadedCVs = getSavedCVs();
    setCvs(loadedCVs);
    if (loadedCVs.length > 0) {
      setCurrentCV(loadedCVs[0]);
    } else {
      // First visit: pre-load sample CV so the app feels populated
      setCurrentCV(getSampleCV());
    }
  }, []);

  const handleSave = () => {
    saveCV(currentCV);
    setCvs(getSavedCVs());
  };

  const handleCreateNew = () => {
    const newCV = getDefaultCV();
    setCurrentCV(newCV);
  };

  const handleLoadSample = () => {
    // We can either generate a new sample and save it, or just inject into current view
    // Let's create a new CV object populated with sample data
    const sample = getSampleCV();
    setCurrentCV(sample);
  };

  const handleDelete = (id) => {
    deleteCV(id);
    const updated = getSavedCVs();
    setCvs(updated);
    if (currentCV.id === id) {
      setCurrentCV(updated.length > 0 ? updated[0] : getDefaultCV());
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('cv-preview-content');
    const opt = {
      margin: 0,
      filename: `${currentCV.personalInfo?.fullName || 'curriculum'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container minimal-theme">
      {/* Primary Sidebar (Icons only) */}
      <div className="primary-sidebar">
        <div className="nav-top">
          <div className="brand" title="Creador CV">CV</div>
          <button className={`nav-icon ${activeTab === 'personalInfo' ? 'active' : ''}`} onClick={() => setActiveTab('personalInfo')} title="Datos Personales">
            <User size={24} />
            {activeTab === 'personalInfo' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')} title="Experiencia">
            <Briefcase size={24} />
            {activeTab === 'experience' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'education' ? 'active' : ''}`} onClick={() => setActiveTab('education')} title="Educación">
            <GraduationCap size={24} />
            {activeTab === 'education' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')} title="Habilidades">
            <Code size={24} />
            {activeTab === 'skills' && <span className="active-indicator"></span>}
          </button>
          <button className={`nav-icon ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Configuración Global">
            <Settings size={24} />
            {activeTab === 'settings' && <span className="active-indicator"></span>}
          </button>
        </div>

        <div className="nav-bottom">
          <button className="nav-icon action new hide-mobile" onClick={handleCreateNew} title="Crear Nuevo">
            <Plus size={24} />
          </button>
          <button className="nav-icon action save hide-mobile" onClick={handleSave} title="Guardar">
            <Save size={24} />
          </button>
          <button className="nav-icon action pdf" onClick={handleDownloadPDF} title="Descargar PDF">
            <Download size={24} />
          </button>
          {cvs.some(c => c.id === currentCV.id) && (
            <button className="nav-icon action danger" onClick={() => handleDelete(currentCV.id)} title="Borrar CV">
              <Trash2 size={24} />
            </button>
          )}
          <a
            href="https://www.linkedin.com/jobs/application-settings/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon action"
            title="Subir a LinkedIn"
            style={{ color: '#0a66c2', marginTop: 'auto' }}
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://github.com/konstantinWDK/CV-Creator"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon action"
            title="Ver código en GitHub"
            style={{ color: '#ffffff', marginTop: '10px' }}
          >
            <Github size={24} />
          </a>
        </div>
      </div>

      {/* Secondary Sidebar (Form Content) */}
      <div className="secondary-sidebar">
        <div className="sidebar-content">
          {activeTab === 'settings' ? (
            <div className="settings-panel">
              <h2 className="panel-title">Configuración Global</h2>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Seleccionar Currículum Guardado</label>
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
                    {cvs.some(c => c.id === currentCV.id) ? currentCV.personalInfo?.fullName || 'CV sin título' : 'CV Nuevo'}
                  </option>
                  {cvs.map(cv => (
                    <option key={cv.id} value={cv.id}>
                      {cv.personalInfo?.fullName || 'CV sin título'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Diseño de la Plantilla</label>
                <select
                  className="cv-selector-minimal"
                  style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                  value={currentCV.templateId || 'minimal'}
                  onChange={(e) => setCurrentCV({ ...currentCV, templateId: e.target.value })}
                >
                  <option value="minimal">Minimalista (Blanco)</option>
                  <option value="modern">Moderno (Sidebar Oscuro)</option>
                  <option value="minimal-plus">Minimalista Plus (Azul)</option>
                  <option value="professional">Profesional (Dos Columnas)</option>
                  <option value="classic">Clásico (Centrado)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Tipografía Global</label>
                <select
                  className="cv-selector-minimal"
                  style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                  value={currentCV.fontFamily || 'Inter'}
                  onChange={(e) => setCurrentCV({ ...currentCV, fontFamily: e.target.value })}
                >
                  <option value="Inter">Inter (Moderna)</option>
                  <option value="Outfit">Outfit (Geométrica)</option>
                  <option value="Roboto">Roboto (Clásica)</option>
                  <option value="Merriweather">Merriweather (Elegante/Serif)</option>
                  <option value="'Courier Prime', monospace">Courier (Máquina de escribir)</option>
                </select>
              </div>

              {currentCV.templateId !== 'modern' && (
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Espaciado (Márgenes de la hoja)</label>
                  <select
                    className="cv-selector-minimal"
                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', width: '100%', padding: '0.75rem', borderRadius: '0.5rem' }}
                    value={currentCV.paddingLevel || 'normal'}
                    onChange={(e) => setCurrentCV({ ...currentCV, paddingLevel: e.target.value })}
                  >
                    <option value="compact">Un poco</option>
                    <option value="medium">Un poco más</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              )}
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
          title="Cerrar Vista Previa"
        >
          <X size={22} />
        </button>
        <div className="preview-scaler">
          <CVPreview data={currentCV} />
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      <div className="mobile-floating-actions">
        <button className="fab-btn fab-new" onClick={handleCreateNew} title="Nuevo CV">
          <Plus size={20} />
        </button>
        <button className="fab-btn fab-save" onClick={handleSave} title="Guardar">
          <Save size={20} />
        </button>
        <button
          className={`fab-btn fab-preview${showMobilePreview ? ' active' : ''}`}
          onClick={() => setShowMobilePreview(v => !v)}
          title={showMobilePreview ? 'Ocultar Vista Previa' : 'Ver CV'}
        >
          {showMobilePreview ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

export default App;
