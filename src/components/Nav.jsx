export default function Nav({ inApp, currentScreen, totalScreens, onLogoClick, onStart, view, onGoFeed }) {
  const isFeedArea = ['feed', 'detail', 'profile', 'favorites'].includes(view);

  return (
    <>
      <nav>
        <a href="#" className="logo-holo" style={{ textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); onLogoClick(); }}>
          <img src="/narabot.png" alt="NARA" className="logo-img" />
        </a>

        {/* 퍼블리셔 피드 탭 */}
        <div className="nara-menu-tabs" style={{ display: 'flex', gap: 8 }}>
          <button
            className={`nara-menu-tab${!isFeedArea ? ' active' : ''}`}
            onClick={onLogoClick}
          >AI 영상 생성</button>
          <button
            className={`nara-menu-tab${isFeedArea ? ' active' : ''}`}
            onClick={onGoFeed}
          >퍼블리셔 피드</button>
        </div>

        <div className="nav-dots" style={{ display: inApp && !isFeedArea ? 'flex' : 'none' }}>
          {Array.from({ length: totalScreens }).map((_, i) => (
            <div key={i} className={`dot ${i === currentScreen ? 'active' : ''} ${i < currentScreen ? 'done' : ''}`} />
          ))}
        </div>
      </nav>
      <div className="progress-bar" style={{ display: inApp && !isFeedArea ? 'block' : 'none' }}>
        <div className="progress-fill" style={{ width: `${(currentScreen / (totalScreens - 1)) * 100}%` }} />
      </div>
    </>
  );
}
