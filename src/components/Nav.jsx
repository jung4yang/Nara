import { useState } from 'react';

export default function Nav({ inApp, currentScreen, totalScreens, onLogoClick, view, onGoFeed, onGoHome, user, onLogin, onLogout, onProfileClick }) {
  const [open, setOpen] = useState(false);
  const isFeed = ['feed', 'detail', 'profile', 'favorites'].includes(view);

  return (
    <>
      <nav>
        {/* 로봇 로고 클릭 → 사이드 메뉴 */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} onClick={() => setOpen(true)}>
          <img src="/narabot.png" alt="NARA" className="logo-img" />
        </button>

        <div className="nav-dots" style={{ display: inApp && !isFeed ? 'flex' : 'none' }}>
          {Array.from({ length: totalScreens }).map((_, i) => (
            <div key={i} className={`dot ${i === currentScreen ? 'active' : ''} ${i < currentScreen ? 'done' : ''}`} />
          ))}
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

      {/* 사이드 메뉴 */}
      <div style={{
        position: 'fixed', top: 0, bottom: 0, left: open ? 0 : -280,
        width: 260, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        zIndex: 1002, transition: 'left 0.28s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column', padding: '20px 0',
      }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 18, fontWeight: 800 }} className="logo-holo">NARA</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 22, color: 'var(--text2)', cursor: 'pointer' }}>×</button>
        </div>

        {/* 메뉴 항목 */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          {[
            { icon: '⌂', label: '홈', active: view === 'landing', onClick: () => { onGoHome(); setOpen(false); } },
            { icon: '✦', label: 'AI 영상 생성', active: view === 'app', onClick: () => { onLogoClick(); setOpen(false); } },
            { icon: '▣', label: '퍼블리셔 피드', active: isFeed, onClick: () => { onGoFeed(); setOpen(false); } },
          ].map(({ icon, label, active, onClick }) => (
            <button key={label} onClick={onClick} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px', background: 'none', border: 'none',
              color: active ? 'var(--accent)' : 'var(--text)',
              fontWeight: active ? 700 : 400,
              fontSize: 14, cursor: 'pointer', textAlign: 'left',
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', color: active ? 'var(--accent)' : 'var(--text2)' }}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--border)', margin: '8px 20px' }} />

        {/* 로그인/프로필 */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
          {user ? (
            <>
              <button onClick={() => { onProfileClick(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--text)', fontSize: 14, cursor: 'pointer' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name}
              </button>
              <button onClick={() => { onLogout(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--text2)', fontSize: 14, cursor: 'pointer' }}>
                <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>↩</span> 로그아웃
              </button>
            </>
          ) : (
            <button onClick={() => { onLogin(); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: 'none', border: 'none', color: 'var(--accent)', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>→</span> 로그인
            </button>
          )}
        </div>
      </div>
    </>
  );
}
