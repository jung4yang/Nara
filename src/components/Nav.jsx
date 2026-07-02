import { useState } from 'react';
import { Menu, X, Home, Sparkles, LayoutGrid, LogOut, LogIn, Globe } from 'lucide-react';
import { useLang } from '../i18n';

export default function Nav({ inApp, currentScreen, totalScreens, onLogoClick, view, onGoFeed, onGoHome, user, onLogin, onLogout, onProfileClick }) {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLang();
  const isFeed = ['feed', 'detail', 'profile', 'favorites'].includes(view);

  return (
    <>
      <nav>
        {/* 로봇 로고 → 홈 */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} onClick={onGoHome}>
          <img src="/narabot.png" alt="NARA" className="logo-img" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="nav-dots" style={{ display: inApp && !isFeed ? 'flex' : 'none' }}>
            {Array.from({ length: totalScreens }).map((_, i) => (
              <div key={i} className={`dot ${i === currentScreen ? 'active' : ''} ${i < currentScreen ? 'done' : ''}`} />
            ))}
          </div>

          {/* 언어 토글 */}
          <button
            className="nav-lang-btn"
            onClick={toggle}
            aria-label={lang === 'ko' ? 'Switch to English' : '한국어로 전환'}
            title={lang === 'ko' ? 'English' : '한국어'}
          >
            <Globe size={15} /> {lang === 'ko' ? 'EN' : '한'}
          </button>

          {/* 로그인 / 로그아웃 (nav 직접 노출) */}
          {user ? (
            <button className="nav-logout-btn" onClick={onLogout} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={15} /> {t.nav.logout}
            </button>
          ) : (
            <button className="nav-login-btn" onClick={onLogin} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <LogIn size={15} /> {t.nav.login}
            </button>
          )}

          {/* 햄버거 메뉴 */}
          <button
            className="nav-menu-btn"
            aria-label="메뉴"
            onClick={() => setOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--text)' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <div className="progress-bar" style={{ display: inApp && !isFeed ? 'block' : 'none' }}>
        <div className="progress-fill" style={{ width: `${(currentScreen / (totalScreens - 1)) * 100}%` }} />
      </div>

      {/* 백드롭 */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* 사이드 메뉴 (오른쪽) */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, right: open ? 0 : -300,
        width: 260, background: 'var(--surface)', borderLeft: '1px solid var(--border)',
        zIndex: 1002, transition: 'right 0.28s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18, fontWeight: 800 }} className="logo-holo">NARA</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={22} />
          </button>
        </div>

        {/* 메뉴 항목 */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          {[
            { Icon: Home, label: t.nav.home, active: view === 'landing', onClick: () => { onGoHome(); setOpen(false); } },
            { Icon: Sparkles, label: t.nav.create, active: view === 'app', onClick: () => { onLogoClick(); setOpen(false); } },
            { Icon: LayoutGrid, label: t.nav.feed, active: isFeed, onClick: () => { onGoFeed(); setOpen(false); } },
          ].map(({ Icon, label, active, onClick }) => (
            <button key={label} onClick={onClick} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', background: 'none', border: 'none',
              color: active ? 'var(--accent)' : 'var(--text)',
              fontWeight: active ? 700 : 400,
              fontSize: 14, cursor: 'pointer', textAlign: 'left',
            }}>
              <Icon size={18} style={{ flexShrink: 0, color: active ? 'var(--accent)' : 'var(--text2)' }} />
              {label}
            </button>
          ))}
        </div>

        {/* 로그인 시에만 계정 섹션 노출 (로그인 버튼은 nav에 직접 배치) */}
        {user && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 20px', marginTop: 'auto' }} />
            <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
              <button onClick={() => { onProfileClick(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name}
              </button>
              <button onClick={() => { onLogout(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--text2)', fontSize: 14, cursor: 'pointer' }}>
                <LogOut size={18} style={{ flexShrink: 0 }} /> {t.nav.logout}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
