import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useLang } from '../../i18n';

export default function LoginModal({ onClose, onLogin }) {
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin({ email: email || 'publisher@nara.ai', name: email.split('@')[0] || 'Publisher' });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="logo-holo" style={{ fontSize: 20, fontWeight: 800 }}>NARA</div>
            <button className="modal-close" onClick={onClose}><X size={20} /></button>
          </div>
          <h2 className="modal-title">{t.login.title}</h2>
          <p className="modal-desc">{t.login.desc}</p>

          <form onSubmit={handleLogin}>
            <div className="modal-field">
              <label>{t.login.email}</label>
              <input
                type="email"
                className="form-input"
                placeholder="publisher@nara.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>{t.login.password}</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-start" style={{ width: '100%', marginTop: 16 }}>
              {t.login.submit} <ArrowRight size={16} style={{ verticalAlign: '-3px' }} />
            </button>
          </form>

          <div className="modal-divider">{t.login.or}</div>
          <button className="modal-social-btn" onClick={handleLogin}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            {t.login.google}
          </button>
          <p className="modal-footer">{t.login.noAccount} <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>{t.login.signup}</span></p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
