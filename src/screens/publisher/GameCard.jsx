import { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { badgeTone, toggleFavorite, isFavorite } from './publisher';
import { showToast } from './Toast';
import { useLang } from '../../i18n';

export default function GameCard({ game, thumbHeight, onDetail }) {
  const { t, tw } = useLang();
  const [saved, setSaved] = useState(isFavorite(game.id));

  function handleFavorite(e) {
    e.stopPropagation();
    const added = toggleFavorite(game.id);
    setSaved(added);
    showToast(added ? t.toast.saved : t.toast.removed);
  }

  const thumbStyle = undefined;

  return (
    <article className="game-card" onClick={() => onDetail(game.id)}>
      <div className={`thumb ${game.colorClass}${thumbHeight ? ` ${thumbHeight}` : ''}`} style={thumbStyle}>
        {game.thumbnail && (
          <img
            src={game.thumbnail}
            alt={game.title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        <span className="badge thumb-badge-tl">{tw(game.platformBadge)}</span>
        <span className={`badge ${badgeTone(game.progressTone)} thumb-badge-br`}>{tw(game.progress)}</span>
        <div className="play-btn"><Play size={20} fill="currentColor" /></div>
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{game.title}</h3>
          <button className={`heart-btn${saved ? ' saved' : ''}`} onClick={handleFavorite} title={saved ? '관심 해제' : '관심 저장'}>
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="card-sub">{game.studio}</p>
        <div className="chip-wrap">
          {game.genre.map((g) => <span key={g} className="chip">{tw(g)}</span>)}
        </div>
      </div>
    </article>
  );
}
