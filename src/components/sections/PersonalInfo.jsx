import { useTranslation } from 'react-i18next';

const PersonalInfo = ({ data = {}, onChange }) => {
    const { t } = useTranslation();
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
            <h2 className="panel-title">{t('forms.personalInfo.title')}</h2>
            <div className="form-group">
                <label>{t('forms.personalInfo.photo')}</label>
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
                            title={t('forms.personalInfo.deletePhoto')}
                            style={{ padding: '4px' }}
                        >
                            <span style={{ fontSize: '10px', padding: '0 4px' }}>✕</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="form-group">
                <label>{t('forms.personalInfo.fullName')}</label>
                <input
                    type="text"
                    name="fullName"
                    value={data.fullName || ''}
                    onChange={handleChange}
                    placeholder={t('forms.personalInfo.fullNamePlaceholder')}
                />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>{t('forms.personalInfo.email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email || ''}
                        onChange={handleChange}
                        placeholder={t('forms.personalInfo.emailPlaceholder')}
                    />
                </div>
                <div className="form-group">
                    <label>{t('forms.personalInfo.phone')}</label>
                    <input
                        type="tel"
                        name="phone"
                        value={data.phone || ''}
                        onChange={handleChange}
                        placeholder={t('forms.personalInfo.phonePlaceholder')}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>{t('forms.personalInfo.address')}</label>
                <input
                    type="text"
                    name="address"
                    value={data.address || ''}
                    onChange={handleChange}
                    placeholder={t('forms.personalInfo.addressPlaceholder')}
                />
            </div>
            <div className="form-group">
                <label>{t('forms.personalInfo.website')}</label>
                <input
                    type="text"
                    name="website"
                    value={data.website || ''}
                    onChange={handleChange}
                    placeholder={t('forms.personalInfo.websitePlaceholder')}
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
                    {t('forms.personalInfo.showQr')}
                </label>
            </div>
            {data.showQrCode && (
                <div className="form-group" style={{ marginBottom: '1rem', paddingLeft: '28px' }}>
                    <label style={{ fontSize: '0.85rem' }}>{t('forms.personalInfo.qrType')}</label>
                    <select
                        name="qrCodeType"
                        value={data.qrCodeType || 'link'}
                        onChange={handleChange}
                        className="cv-selector-minimal"
                        style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
                    >
                        <option value="link">{t('forms.personalInfo.qrLink')}</option>
                        <option value="github">{t('forms.personalInfo.qrGithub')}</option>
                        <option value="linkedin">{t('forms.personalInfo.qrLinkedin')}</option>
                    </select>
                </div>
            )}
            <div className="form-group">
                <label>{t('forms.personalInfo.summary')}</label>
                <textarea
                    name="summary"
                    value={data.summary || ''}
                    onChange={handleChange}
                    rows="4"
                    placeholder={t('forms.personalInfo.summaryPlaceholder')}
                />
            </div>
        </div>
    );
};

export default PersonalInfo;
