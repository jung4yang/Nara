import { useState, useMemo } from 'react';
import { Clapperboard, Play } from 'lucide-react';
import GameCard from './GameCard';
import { filterGames, getGenreOptions } from './publisher';

const PLATFORM_OPTIONS = ['전체', 'PC', '모바일', '콘솔'];
const SORT_OPTIONS = ['최신순', '관심순'];

// 숏폼 데이터 (thumbnail: 피드 표시용, video: 뷰어 재생용)
const SHORTS = [
  { id: 's1', title: 'Shadow of Aria', studio: 'DeepLight', duration: '0:30', colorClass: 'color-purple', thumbnail: '/short4.png', video: '/short_result.mp4' },
  { id: 's2', title: 'Neon Blade', studio: 'PixelForge', duration: '0:20', colorClass: 'color-cyan', thumbnail: '/pub_short2.png', video: '/pub_short2.mp4' },
  { id: 's3', title: 'Whisper Forest', studio: 'MoonSeed', duration: '0:25', colorClass: 'color-green', thumbnail: '/pub_short3.png', video: null },
  { id: 's4', title: 'Void Runner', studio: 'StarBurst', duration: '0:15', colorClass: 'color-red', thumbnail: '/pub_short4.png', video: null },
  { id: 's5', title: 'Crystal Cave', studio: 'GemStudio', duration: '0:35', colorClass: 'color-purple', thumbnail: '/pub_short5.png', video: null },
];

export default function FeedPage({ onDetail, onOpenShorts }) {
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
      {/* 숏폼 섹션 - 피드 상단 가로 스크롤 */}
      <div className="shorts-strip-section">
        <div className="shorts-strip-head">
          <span className="shorts-strip-label"><Clapperboard size={16} style={{ verticalAlign: '-3px', marginRight: 6 }} />숏폼</span>
          <span className="shorts-strip-sub">클릭해서 감상하세요</span>
        </div>
        <div className="shorts-strip">
          {SHORTS.map((short, i) => (
            <div
              key={short.id}
              className={`shorts-strip-card ${short.colorClass}`}
              onClick={() => onOpenShorts(i)}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {short.thumbnail && (
                <img src={short.thumbnail} alt={short.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />
              )}
              <div className="shorts-strip-play" style={{ zIndex: 1, position: 'relative' }}><Play size={26} fill="currentColor" /></div>
              <div className="shorts-strip-duration" style={{ zIndex: 1 }}>{short.duration}</div>
              <div className="shorts-strip-info" style={{ zIndex: 1 }}>
                <div className="shorts-strip-title">{short.title}</div>
                <div className="shorts-strip-studio">{short.studio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 필터 */}
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

      {/* 게임 카드 그리드 */}
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
