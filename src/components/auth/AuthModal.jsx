import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, apiUrl }) => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            if (isLogin) {
                login(data.user, data.token);
                onClose();
            } else {
                setIsLogin(true);
                setError(t('auth.registerSuccess'));
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <button className="auth-close" onClick={onClose}><X size={20} /></button>

                <div className="auth-header">
                    <h2>{isLogin ? t('auth.loginTitle') : t('auth.registerTitle')}</h2>
                    <p>{isLogin ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}</p>
                </div>

                {error && <div className={`auth-message ${error.includes('uccess') ? 'success' : 'error'}`}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label><Mail size={16} /> {t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div className="auth-field">
                        <label><Lock size={16} /> {t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? t('auth.loginBtn') : t('auth.registerBtn'))}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLogin ? (
                        <p>{t('auth.noAccount')} <button onClick={() => setIsLogin(false)}>{t('auth.signup')}</button></p>
                    ) : (
                        <p>{t('auth.hasAccount')} <button onClick={() => setIsLogin(true)}>{t('auth.signin')}</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
