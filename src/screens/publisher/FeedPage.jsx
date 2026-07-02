import { useState, useMemo } from 'react';
import GameCard from './GameCard';
import { filterGames, getGenreOptions } from './publisher';

const PLATFORM_OPTIONS = ['전체', 'PC', '모바일', '콘솔'];
const SORT_OPTIONS = ['최신순', '관심순'];

export default function FeedPage({ onDetail }) {
  const [genre, setGenre] = useState('전체');
  const [platform, setPlatform] = useState('전체');
  const [sort, setSort] = useState('최신순');
  const [query, setQuery] = useState('');

  const baseGames = filterGames(genre, platform, sort);
  const genres = getGenreOptions();

  const games = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return baseGames;
    return baseGames.filter((game) => {
      const searchable = [game.title, game.studio, game.description, game.platform.join(' '), game.genre.join(' ')].join(' ').toLowerCase();
      return searchable.includes(keyword);
    });
  }, [baseGames, query]);

  return (
    <div className="pub-wrap">
      <div className="filter-row filter-row-top">
        <label className="filter-field filter-field-search">
          <span>검색</span>
          <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="게임명, 스튜디오, 태그 검색" />
        </label>
        <label className="filter-field">
          <span>정렬</span>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="filter-field">
          <span>장르</span>
          <select className="select" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="filter-field">
          <span>플랫폼</span>
          <select className="select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORM_OPTIONS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
      </div>
      <section className="game-grid">
        {games.map((game) => <GameCard key={game.id} game={game} onDetail={onDetail} />)}
      </section>
      {games.length === 0 && (
        <div className="empty-state">
          <h3>게임이 없습니다</h3>
          <p>검색어 또는 필터 조건을 다시 확인해보세요.</p>
        </div>
      )}
    </div>
  );
}
