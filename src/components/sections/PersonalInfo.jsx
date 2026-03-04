const PersonalInfo = ({ data = {}, onChange }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        onChange({ ...data, [name]: type === 'checkbox' ? checked : value });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ ...data, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="glass-panel">
            <h2 className="panel-title">Datos Personales</h2>
            <div className="form-group">
                <label>Foto de Perfil</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ padding: '0.4rem' }}
                />
                {data.photo && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={data.photo} alt="Vista previa" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }} />
                        <button
                            type="button"
                            className="btn btn-danger btn-icon-only"
                            onClick={() => onChange({ ...data, photo: null })}
                            title="Eliminar Foto"
                            style={{ padding: '4px' }}
                        >
                            <span style={{ fontSize: '10px', padding: '0 4px' }}>✕</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="form-group">
                <label>Nombre Completo</label>
                <input
                    type="text"
                    name="fullName"
                    value={data.fullName || ''}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email || ''}
                        onChange={handleChange}
                        placeholder="juan@ejemplo.com"
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        placeholder="+34 600 000 000"
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Dirección</label>
                <input
                    type="text"
                    name="address"
                    value={data.address || ''}
                    onChange={handleChange}
                    placeholder="Ciudad, País"
                />
            </div>
            <div className="form-group">
                <label>Página Web / GitHub</label>
                <input
                    type="text"
                    name="website"
                    value={data.website || ''}
                    onChange={handleChange}
                    placeholder="https://..."
                />
            </div>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <input
                    type="checkbox"
                    name="showQrCode"
                    checked={data.showQrCode || false}
                    onChange={handleChange}
                    style={{ width: 'auto', padding: 0 }}
                />
                <label style={{ cursor: 'pointer', margin: 0 }} onClick={() => onChange({ ...data, showQrCode: !data.showQrCode })}>
                    Generar Código QR en el CV (apunta a la URL)
                </label>
            </div>
            {data.showQrCode && (
                <div className="form-group" style={{ marginBottom: '1rem', paddingLeft: '28px' }}>
                    <label style={{ fontSize: '0.85rem' }}>Tipo de Enlace</label>
                    <select
                        name="qrCodeType"
                        value={data.qrCodeType || 'link'}
                        onChange={handleChange}
                        className="cv-selector-minimal"
                        style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                    >
                        <option value="link">Personal (Icono Web)</option>
                        <option value="github">Repositorio (Icono GitHub)</option>
                        <option value="linkedin">Perfil Profesional (Icono LinkedIn)</option>
                    </select>
                </div>
            )}
            <div className="form-group">
                <label>Resumen Profesional</label>
                <textarea
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Un breve resumen de tu perfil profesional..."
                />
            </div>
        </div>
    );
};

export default PersonalInfo;
