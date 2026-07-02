import { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { getGames, getFavorites, toggleFavorite } from './publisher';
import { showToast } from './Toast';

export default function FavoritesPage({ onBack, onDetail }) {
  const [favIds, setFavIds] = useState(() => getFavorites());
  const favGames = getGames().filter((g) => favIds.includes(g.id));

  function handleRemove(id) {
    toggleFavorite(id);
    setFavIds(getFavorites());
    showToast('관심 게임에서 제거했습니다.');
  }

  return (
    <>
      <div className="page-actions favorites-top-actions">
        <button className="btn btn-primary" onClick={onBack}>피드로 돌아가기</button>
      </div>
      {favGames.length > 0 ? (
        <section className="fav-list">
          {favGames.map((game) => (
            <article key={game.id} className="fav-item">
              <button className={`fav-thumb ${game.colorClass}`} onClick={() => onDetail(game.id)}><Play size={18} fill="currentColor" /></button>
              <div>
                <button className="fav-title-button" onClick={() => onDetail(game.id)}>{game.title}</button>
                <p className="card-sub" style={{ marginBottom: 10 }}>{game.studio}</p>
                <div className="chip-wrap">
                  <span className="chip">{game.platformBadge}</span>
                  {game.genre.map((g) => <span key={g} className="chip">{g}</span>)}
                </div>
              </div>
              <div className="fav-item-actions">
                <button className="heart-list saved" onClick={() => handleRemove(game.id)}><Heart size={20} fill="currentColor" /></button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <h3>관심 등록한 게임이 없습니다.</h3>
          <p style={{ marginTop: 8 }}>NARA 피드에서 하트를 눌러 저장해보세요.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onBack}>피드 보러 가기</button>
        </div>
      )}
    </>
  );
}
