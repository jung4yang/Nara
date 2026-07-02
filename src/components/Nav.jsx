export default function Nav({ inApp, currentScreen, totalScreens, onLogoClick, view, onGoFeed, onLoginClick, user, onProfileClick }) {
  const isFeedArea = ['feed', 'detail', 'profile', 'favorites'].includes(view);

  return (
    <>
      <nav>
        <a href="#" className="logo-holo" style={{ textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onLogoClick(); }}>
          <img src="/narabot.png" alt="NARA" className="logo-img" />
        </a>
        <div className="nara-menu-tabs">
          <button className={`nara-menu-tab${!isFeedArea ? ' active' : ''}`} onClick={onLogoClick}>AI 영상 생성</button>
          <button className={`nara-menu-tab${isFeedArea ? ' active' : ''}`} onClick={onGoFeed}>퍼블리셔 피드</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="nav-dots" style={{ display: inApp && !isFeedArea ? 'flex' : 'none' }}>
            {Array.from({ length: totalScreens }).map((_, i) => (
              <div key={i} className={`dot ${i === currentScreen ? 'active' : ''} ${i < currentScreen ? 'done' : ''}`} />
            ))}
          </div>
          {user ? (
            <button className="nav-avatar" onClick={onProfileClick} title={user.name}>
              {user.name.slice(0, 1).toUpperCase()}
            </button>
          ) : (
            <button className="nav-login-btn" onClick={onLoginClick}>로그인</button>
          )}
        </div>
      </nav>
      <div className="progress-bar" style={{ display: inApp && !isFeedArea ? 'block' : 'none' }}>
        <div className="progress-fill" style={{ width: `${(currentScreen / (totalScreens - 1)) * 100}%` }} />
      </div>
    </>
  );
}
