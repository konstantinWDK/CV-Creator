import { useState, useEffect } from 'react';
import { Download, Save, Plus, Trash2, Eye, X } from 'lucide-react';
import { getSavedCVs, saveCV, deleteCV, getDefaultCV } from './utils/storage';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import html2pdf from 'html2pdf.js';

function App() {
  const [cvs, setCvs] = useState([]);
  const [currentCV, setCurrentCV] = useState(getDefaultCV());
  const [showPreview, setShowPreview] = useState(false);

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
      filename: `${currentCV.personalInfo?.fullName || 'cv'}-resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="app-header">
          <h1 className="title-gradient">CV Creator</h1>
          <p className="subtitle">Build your premium resume in minutes</p>
        </div>

        <div className="actions-top">
          <select
            className="cv-selector"
            value={currentCV.id}
            onChange={(e) => {
              const selected = cvs.find(c => c.id === e.target.value);
              if (selected) setCurrentCV(selected);
            }}
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--glass-border)', outline: 'none' }}
          >
            <option value={currentCV.id} disabled={cvs.some(c => c.id === currentCV.id)}>
              {cvs.some(c => c.id === currentCV.id) ? currentCV.personalInfo?.fullName || 'Untitled CV' : 'New CV'}
            </option>
            {cvs.map(cv => (
              <option key={cv.id} value={cv.id}>
                {cv.personalInfo?.fullName || 'Untitled CV'}
              </option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-icon-only" onClick={handleCreateNew} title="Create New CV">
              <Plus size={20} />
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={20} /> Save
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadPDF} title="Download PDF">
              <Download size={20} /> PDF
            </button>
            {cvs.some(c => c.id === currentCV.id) && (
              <button className="btn btn-danger btn-icon-only" onClick={() => handleDelete(currentCV.id)} title="Delete CV">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        <CVForm data={currentCV} onChange={setCurrentCV} />
      </div>

      <div className="preview-container">
        <CVPreview data={currentCV} />
      </div>
    </div>
  );
}

export default App;
