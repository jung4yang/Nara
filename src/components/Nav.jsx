export default function Nav({ inApp, currentScreen, totalScreens, onLogoClick, onStart }) {
  return (
    <>
      <nav>
        <a
          href="#"
          className="logo-holo"
          style={{ textDecoration: 'none' }}
          onClick={(e) => { e.preventDefault(); onLogoClick(); }}
        >
          <img src="/narabot.png" alt="NARA" className="logo-img" />
        </a>
        <div className="nav-dots" style={{ display: inApp ? 'flex' : 'none' }}>
          {Array.from({ length: totalScreens }).map((_, i) => (
            <div
              key={i}
              className={`dot ${i === currentScreen ? 'active' : ''} ${i < currentScreen ? 'done' : ''}`}
            />
          ))}
        </div>
      </nav>
      <div className="progress-bar" style={{ display: inApp ? 'block' : 'none' }}>
        <div
          className="progress-fill"
          style={{ width: `${(currentScreen / (totalScreens - 1)) * 100}%` }}
        />
      </div>
    </>
  );
}
