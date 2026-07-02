import { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { badgeTone, toggleFavorite, isFavorite } from './publisher';
import { showToast } from './Toast';

export default function GameCard({ game, thumbHeight, onDetail }) {
  const [saved, setSaved] = useState(isFavorite(game.id));

  function handleFavorite(e) {
    e.stopPropagation();
    const added = toggleFavorite(game.id);
    setSaved(added);
    showToast(added ? '관심 게임에 저장했습니다.' : '관심 게임에서 제거했습니다.');
  }

  const thumbStyle = game.thumbnail ? { backgroundImage: `url(${game.thumbnail})` } : undefined;

  return (
    <article className="game-card" onClick={() => onDetail(game.id)}>
      <div className={`thumb ${game.colorClass}${thumbHeight ? ` ${thumbHeight}` : ''}${game.thumbnail ? ' thumb-has-image' : ''}`} style={thumbStyle}>
        <span className="badge thumb-badge-tl">{game.platformBadge}</span>
        <span className={`badge ${badgeTone(game.progressTone)} thumb-badge-br`}>{game.progress}</span>
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
          {game.genre.map((g) => <span key={g} className="chip">{g}</span>)}
        </div>
      </div>
    </article>
  );
}
