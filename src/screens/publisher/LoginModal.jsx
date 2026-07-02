import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginModal({ onClose, onLogin }) {
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
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <h2 className="modal-title">퍼블리셔 로그인</h2>
          <p className="modal-desc">NARA 퍼블리셔 계정으로 로그인하세요.</p>

          <form onSubmit={handleLogin}>
            <div className="modal-field">
              <label>이메일</label>
              <input
                type="email"
                className="form-input"
                placeholder="publisher@nara.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>비밀번호</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-start" style={{ width: '100%', marginTop: 16 }}>
              로그인 →
            </button>
          </form>

          <div className="modal-divider">또는</div>
          <button className="modal-social-btn" onClick={handleLogin}>
            <span>G</span> Google로 계속하기
          </button>
          <p className="modal-footer">계정이 없으신가요? <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>회원가입</span></p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
