import { useState } from 'react';
import { ArrowLeft, Play, Heart, Maximize, Sparkles, Cat, Rabbit, Bird, User, PawPrint, Sprout } from 'lucide-react';
import { getGame, getGames, getDeveloper, badgeTone, toggleFavorite, isFavorite } from './publisher';
import { showToast } from './Toast';

export default function DetailPage({ gameId, onBack, onProfile }) {
  const game = getGame(gameId);
  const [videoIndex, setVideoIndex] = useState(0);
  const [saved, setSaved] = useState(isFavorite(gameId));
  const [supportersExpanded, setSupportersExpanded] = useState(false);

  if (!game) return (
    <div className="empty-state" style={{ marginTop: 48 }}>
      <h3>게임을 찾을 수 없습니다.</h3>
      <button className="btn" onClick={onBack}>피드로 돌아가기</button>
    </div>
  );

  const developer = getDeveloper(game.developerId);
  const relatedGames = getGames().filter((item) => item.id !== game.id && item.genre.some((tag) => game.genre.includes(tag))).slice(0, 4);

  const supporters = [
    { name: '@LunaForge', Avatar: Cat, status: '퍼블리싱 검토' },
    { name: '@PixelRabbit', Avatar: Rabbit, status: '후원' },
    { name: '@NightOwl', Avatar: Bird, status: '후원' },
    { name: '@BlueMint', Avatar: User, status: '퍼블리싱 검토' },
    { name: '@ArcadeFox', Avatar: PawPrint, status: '후원' },
    { name: '@NovaSeed', Avatar: Sprout, status: '후원' },
  ];
  const visibleSupporters = supportersExpanded ? supporters : supporters.slice(0, 4);

  function handleFavorite() {
    const added = toggleFavorite(game.id);
    setSaved(added);
    showToast(added ? '관심 게임에 저장했습니다.' : '관심 게임에서 제거했습니다.');
  }

  return (
    <>
      <div className="detail-top-actions">
        <button className="btn" onClick={onBack}><ArrowLeft size={16} style={{ verticalAlign: '-3px', marginRight: 4 }} />피드로</button>
      </div>
      <section className="detail-layout">
        <div className="panel detail-video-panel">
          <div className="detail-game-heading">
            <h1>{game.title}</h1>
            <p>{game.videos[videoIndex] ?? game.videos[0]}</p>
          </div>
          <div className={`player-art ${game.colorClass}`}>
            <div className="play-btn" style={{ width: 60, height: 60 }}><Play size={26} fill="currentColor" /></div>
            <div className="player-controls">
              <Play size={16} fill="currentColor" />
              <span style={{ fontSize: 13, opacity: 0.8 }}>0:00 / 1:30</span>
              <div className="time-bar"><span /></div>
              <Maximize size={16} />
            </div>
          </div>
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
                <strong>관련 태그 추천 영상</strong>
                <span>{game.genre.join(' · ')} 기반 추천</span>
              </div>
              <div className="related-video-grid">
                {relatedGames.map((item) => (
                  <button key={item.id} className="related-video-card" onClick={() => onBack(item.id)}>
                    <div className={`related-video-thumb ${item.colorClass}`}><Play size={16} fill="currentColor" /></div>
                    <div>
                      <b>{item.title}</b>
                      <small>{item.studio}</small>
                      <div className="chip-wrap">{item.genre.slice(0, 2).map((tag) => <span key={tag} className="chip">#{tag}</span>)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="panel detail-side">
          <div className="panel-body">
            <div className={`detail-developer-cover ${game.colorClass}`} />
            <div className="detail-developer-content">
              <span className="detail-developer-avatar">{(developer?.name ?? game.studio).slice(0, 1)}</span>
              <div className="detail-developer-copy">
                <small>DEVELOPER PROFILE</small>
                <strong>{developer?.name ?? game.studio}</strong>
                <span>{developer?.field ?? '게임 개발 스튜디오'}</span>
              </div>
            </div>
            <div className="detail-actions">
              {developer && <button className="btn btn-primary" onClick={() => onProfile(developer.id)}>프로필 보기</button>}
              <button className={`heart-detail${saved ? ' saved' : ''}`} onClick={handleFavorite}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
            </div>
            <div className="chip-wrap" style={{ marginBottom: 6 }}>
              {game.genre.map((g) => <span key={g} className="chip">{g}</span>)}
              <span className={`chip chip-${badgeTone(game.progressTone).replace('badge-', '')}`}>{game.progress}</span>
            </div>
            <div className="info-list">
              <div className="info-item"><span>플랫폼</span><strong>{game.platform.join(', ')}</strong></div>
              <div className="info-item"><span>개발 현황</span><strong>{game.progress}</strong></div>
              <div className="info-item"><span>필요 지원</span><strong>{game.supportNeeds.join(', ')}</strong></div>
            </div>
            <p className="section-title">게임 설명</p>
            <p className="muted">{game.description}</p>
            <p className="section-title">추가 정보</p>
            <div className="info-list">
              <div className="info-item"><span>팀 규모</span><strong>{game.teamSize}</strong></div>
              <div className="info-item"><span>개발 기간</span><strong>{game.period}</strong></div>
              <div className="info-item"><span>주요 엔진</span><strong>{game.engine}</strong></div>
              <div className="info-item"><span>언어</span><strong>{game.language}</strong></div>
            </div>
            <section className={`supporter-card${supportersExpanded ? ' expanded' : ''}`}>
              <div className="supporter-head">
                <div><p className="supporter-label">SUPPORT</p><strong>후원 중인 멤버</strong></div>
                <button className="supporter-more" onClick={() => setSupportersExpanded((o) => !o)}>
                  {supportersExpanded ? '접기' : '더보기 ›'}
                </button>
              </div>
              <div className="supporter-list">
                {visibleSupporters.map((member) => (
                  <div className="supporter-row" key={member.name}>
                    <span className="supporter-avatar"><member.Avatar size={18} /></span>
                    <strong>{member.name}</strong>
                    <span className={`supporter-status ${member.status === '퍼블리싱 검토' ? 'review' : 'sponsor'}`}>{member.status}</span>
                    <button className="supporter-message">메시지</button>
                  </div>
                ))}
              </div>
              <p className="supporter-note"><Sparkles size={13} style={{ verticalAlign: '-2px' }} /> NARA를 통해 후원과 퍼블리싱 검토가 이어지고 있습니다.</p>
            </section>
          </div>
        </aside>
      </section>
    </>
  );
}
