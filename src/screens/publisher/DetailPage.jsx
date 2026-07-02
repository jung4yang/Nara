import { useState } from 'react';
import { ArrowLeft, Play, Heart, Maximize, Sparkles, Cat, Rabbit, Bird, User, PawPrint, Sprout } from 'lucide-react';
import { getGame, getGames, getDeveloper, badgeTone, toggleFavorite, isFavorite } from './publisher';
import { showToast } from './Toast';
import { useLang } from '../../i18n';

export default function DetailPage({ gameId, onBack, onProfile }) {
  const { t, tw } = useLang();
  const game = getGame(gameId);
  const [videoIndex, setVideoIndex] = useState(0);
  const [saved, setSaved] = useState(isFavorite(gameId));
  const [supportersExpanded, setSupportersExpanded] = useState(false);

  if (!game) return (
    <div className="empty-state" style={{ marginTop: 48 }}>
      <h3>{t.detail.notFound}</h3>
      <button className="btn" onClick={onBack}>{t.detail.backToFeedFull}</button>
    </div>
  );

  const developer = getDeveloper(game.developerId);
  const relatedGames = getGames().filter((item) => item.id !== game.id && item.genre.some((tag) => game.genre.includes(tag))).slice(0, 4);

  const supporters = [
    { name: '@LunaForge', Avatar: Cat, review: true },
    { name: '@PixelRabbit', Avatar: Rabbit, review: false },
    { name: '@NightOwl', Avatar: Bird, review: false },
    { name: '@BlueMint', Avatar: User, review: true },
    { name: '@ArcadeFox', Avatar: PawPrint, review: false },
    { name: '@NovaSeed', Avatar: Sprout, review: false },
  ];
  const visibleSupporters = supportersExpanded ? supporters : supporters.slice(0, 4);

  function handleFavorite() {
    const added = toggleFavorite(game.id);
    setSaved(added);
    showToast(added ? t.toast.saved : t.toast.removed);
  }

  return (
    <>
      <section className="detail-layout">
        <div className="panel detail-video-panel">
          <div className="detail-game-heading">
            <h1>{game.title}</h1>
            <p>{String(game.videos[videoIndex] ?? game.videos[0]).startsWith('/') ? '메인 트레일러' : (game.videos[videoIndex] ?? game.videos[0])}</p>
          </div>
          {String(game.videos[videoIndex] ?? game.videos[0]).startsWith('/') ? (
            <div className={`player-art ${game.colorClass}`} style={{ padding: 0 }}>
              <video
                key={game.videos[videoIndex] ?? game.videos[0]}
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              >
                <source src={game.videos[videoIndex] ?? game.videos[0]} type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className={`player-art ${game.colorClass}`}>
              <div className="play-btn" style={{ width: 60, height: 60 }}><Play size={26} fill="currentColor" /></div>
              <div className="player-controls">
                <Play size={16} fill="currentColor" />
                <span style={{ fontSize: 13, opacity: 0.8 }}>0:00 / 1:30</span>
                <div className="time-bar"><span /></div>
                <Maximize size={16} />
              </div>
            </div>
          )}
          <div className="carousel">
            {game.videos.map((name, index) => (
              <button key={index} className={`small-thumb ${game.colorClass}${index === videoIndex ? ' active-thumb' : ''}`} onClick={() => setVideoIndex(index)}>
                <div className="small-thumb-play"><Play size={14} fill="currentColor" /></div>
              </button>
            ))}
          </div>
          {relatedGames.length > 0 && (
            <div className="related-video-section">
              <div className="related-video-head">
                <strong>{t.detail.relatedTitle}</strong>
                <span>{game.genre.map(tw).join(' · ')} {t.detail.relatedSub}</span>
              </div>
              <div className="related-video-grid">
                {relatedGames.map((item) => (
                  <button key={item.id} className="related-video-card" onClick={() => onBack(item.id)}>
                    <div className={`related-video-thumb ${item.colorClass}`}><Play size={16} fill="currentColor" /></div>
                    <div>
                      <b>{item.title}</b>
                      <small>{item.studio}</small>
                      <div className="chip-wrap">{item.genre.slice(0, 2).map((tag) => <span key={tag} className="chip">#{tw(tag)}</span>)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="panel detail-side">
          {developer?.cover ? (
            <div className="detail-developer-cover" style={{ backgroundImage: `url(${developer.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <div className={`detail-developer-cover ${game.colorClass}`} />
          )}
          <div className="panel-body">
            <div className="detail-developer-content">
              {developer?.avatar ? (
                <img className="detail-developer-avatar detail-developer-avatar-img" src={developer.avatar} alt={developer.name} />
              ) : (
                <span className="detail-developer-avatar">{(developer?.name ?? game.studio).slice(0, 1)}</span>
              )}
              <div className="detail-developer-copy">
                <small>{t.detail.devProfile}</small>
                <strong>{developer?.name ?? game.studio}</strong>
                <span>{developer?.field ?? t.detail.defaultStudio}</span>
              </div>
            </div>
            <div className="detail-actions">
              {developer && <button className="btn btn-primary" onClick={() => onProfile(developer.id)}>{t.detail.viewProfile}</button>}
              <button className={`heart-detail${saved ? ' saved' : ''}`} onClick={handleFavorite}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
            </div>
            <div className="chip-wrap" style={{ marginBottom: 6 }}>
              {game.genre.map((g) => <span key={g} className="chip">{tw(g)}</span>)}
              <span className={`chip chip-${badgeTone(game.progressTone).replace('badge-', '')}`}>{tw(game.progress)}</span>
            </div>
            <div className="info-list">
              <div className="info-item"><span>{t.detail.platform}</span><strong>{game.platform.map(tw).join(', ')}</strong></div>
              <div className="info-item"><span>{t.detail.progress}</span><strong>{tw(game.progress)}</strong></div>
              <div className="info-item"><span>{t.detail.support}</span><strong>{game.supportNeeds.map(tw).join(', ')}</strong></div>
            </div>
            <p className="section-title">{t.detail.gameDesc}</p>
            <p className="muted">{game.description}</p>
            <p className="section-title">{t.detail.moreInfo}</p>
            <div className="info-list">
              <div className="info-item"><span>{t.detail.teamSize}</span><strong>{game.teamSize}</strong></div>
              <div className="info-item"><span>{t.detail.period}</span><strong>{game.period}</strong></div>
              <div className="info-item"><span>{t.detail.engine}</span><strong>{game.engine}</strong></div>
              <div className="info-item"><span>{t.detail.language}</span><strong>{game.language}</strong></div>
            </div>
            <section className={`supporter-card${supportersExpanded ? ' expanded' : ''}`}>
              <div className="supporter-head">
                <div><p className="supporter-label">{t.detail.supportLabel}</p><strong>{t.detail.supporters}</strong></div>
                <button className="supporter-more" onClick={() => setSupportersExpanded((o) => !o)}>
                  {supportersExpanded ? t.detail.collapse : t.detail.more}
                </button>
              </div>
              <div className="supporter-list">
                {visibleSupporters.map((member) => (
                  <div className="supporter-row" key={member.name}>
                    <span className="supporter-avatar"><member.Avatar size={18} /></span>
                    <strong>{member.name}</strong>
                    <span className={`supporter-status ${member.review ? 'review' : 'sponsor'}`}>{member.review ? t.detail.review : t.detail.sponsor}</span>
                    <button className="supporter-message">{t.detail.message}</button>
                  </div>
                ))}
              </div>
              <p className="supporter-note"><Sparkles size={13} style={{ verticalAlign: '-2px' }} /> {t.detail.supporterNote}</p>
            </section>
          </div>
        </aside>
      </section>
    </>
  );
}
