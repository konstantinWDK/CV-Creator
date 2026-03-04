import { useState, useEffect } from 'react';
import { Download, Save, Plus, Trash2, User, Briefcase, GraduationCap, Code } from 'lucide-react';
import { getSavedCVs, saveCV, deleteCV, getDefaultCV } from './utils/storage';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import html2pdf from 'html2pdf.js';

function App() {
  const [cvs, setCvs] = useState([]);
  const [currentCV, setCurrentCV] = useState(getDefaultCV());
  const [activeTab, setActiveTab] = useState('personalInfo');

  useEffect(() => {
    const loadedCVs = getSavedCVs();
    setCvs(loadedCVs);
    if (loadedCVs.length > 0) {
      setCurrentCV(loadedCVs[0]);
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
        </div>

        <div className="nav-bottom">
          <button className="nav-icon action new" onClick={handleCreateNew} title="Crear Nuevo">
            <Plus size={24} />
          </button>
          <button className="nav-icon action save" onClick={handleSave} title="Guardar">
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
        </div>
      </div>

      {/* Secondary Sidebar (Settings Panel) */}
      <div className="secondary-sidebar">
        <div className="sidebar-header">
          <select
            className="cv-selector-minimal"
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

        <div className="sidebar-content">
          <CVForm data={currentCV} onChange={setCurrentCV} activeTab={activeTab} />
        </div>
      </div>

      {/* Preview Container */}
      <div className="preview-container">
        <CVPreview data={currentCV} />
      </div>
    </div>
  );
}

export default App;
