import { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import { getGames, getFavorites, toggleFavorite } from './publisher';
import { showToast } from './Toast';
import { useLang } from '../../i18n';

export default function FavoritesPage({ onBack, onDetail }) {
  const { t, tw } = useLang();
  const [favIds, setFavIds] = useState(() => getFavorites());
  const favGames = getGames().filter((g) => favIds.includes(g.id));

  function handleRemove(id) {
    toggleFavorite(id);
    setFavIds(getFavorites());
    showToast(t.toast.removed);
  }

  return (
    <>
      {favGames.length > 0 ? (
        <section className="fav-list">
          {favGames.map((game) => (
            <article key={game.id} className="fav-item">
              <button className={`fav-thumb ${game.colorClass}`} onClick={() => onDetail(game.id)}><Play size={18} fill="currentColor" /></button>
              <div>
                <button className="fav-title-button" onClick={() => onDetail(game.id)}>{game.title}</button>
                <p className="card-sub" style={{ marginBottom: 10 }}>{game.studio}</p>
                <div className="chip-wrap">
                  <span className="chip">{tw(game.platformBadge)}</span>
                  {game.genre.map((g) => <span key={g} className="chip">{tw(g)}</span>)}
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
          <h3>{t.fav.emptyTitle}</h3>
          <p style={{ marginTop: 8 }}>{t.fav.emptyDesc}</p>
        </div>
      )}
    </>
  );
}
