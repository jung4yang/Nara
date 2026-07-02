import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Play, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react';

const SHORTS = [
  { id: 's1', title: 'Shadow of Aria — 메인 트레일러', studio: 'DeepLight Studio', tags: ['RPG', '다크판타지'], duration: '0:30', colorClass: 'color-purple' },
  { id: 's2', title: 'Neon Blade — 액션 하이라이트', studio: 'PixelForge', tags: ['액션', '사이버펑크'], duration: '0:20', colorClass: 'color-cyan' },
  { id: 's3', title: 'Whisper Forest — 게임플레이', studio: 'MoonSeed', tags: ['퍼즐', '힐링'], duration: '0:25', colorClass: 'color-green' },
  { id: 's4', title: 'Void Runner — 티저', studio: 'StarBurst', tags: ['로그라이크', '슈팅'], duration: '0:15', colorClass: 'color-red' },
  { id: 's5', title: 'Crystal Cave — 예고편', studio: 'GemStudio', tags: ['어드벤처'], duration: '0:35', colorClass: 'color-purple' },
];

export default function ShortsViewer({ initialIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [liked, setLiked] = useState(new Set());
  const startY = useRef(null);

  const active = SHORTS[activeIndex];

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(SHORTS.length - 1, i + 1));

  const toggleLike = (id) => {
    setLiked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // 위아래 스와이프
  const handleTouchStart = (e) => { startY.current = e.touches?.[0]?.clientY ?? e.clientY; };
  const handleTouchEnd = (e) => {
    if (startY.current === null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? e.clientY;
    const diff = startY.current - endY;
    if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); }
    startY.current = null;
  };

  // 키보드
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') next();
      if (e.key === 'ArrowUp') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 휠 스크롤
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) < 24) return;
    if (e.deltaY > 0) next(); else prev();
  };

  return (
    <div className="shorts-viewer-overlay" onClick={onClose} onWheel={handleWheel}>
      <div
        className="shorts-viewer"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
      >
        {/* 닫기 */}
        <button className="shorts-close" onClick={onClose}><ArrowLeft size={26} /></button>

        {/* 메인 카드 */}
        <div className={`shorts-card ${active.colorClass}`}>
          <div className="shorts-card-video"><Play size={44} fill="currentColor" /></div>

          {/* 진행 바 (위) */}
          <div className="shorts-top-bar">
            {SHORTS.map((_, i) => (
              <div key={i} className={`shorts-bar-seg ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'done' : ''}`} />
            ))}
          </div>

          {/* 정보 (하단 왼쪽) */}
          <div className="shorts-card-info">
            <div className="shorts-card-tags">
              {active.tags.map((tag) => <span key={tag} className="chip">#{tag}</span>)}
            </div>
            <div className="shorts-card-title">{active.title}</div>
            <div className="shorts-card-studio">{active.studio}</div>
          </div>

          {/* 액션 (하단 오른쪽) */}
          <div className="shorts-card-actions">
            <button className={`shorts-action-btn${liked.has(active.id) ? ' liked' : ''}`} onClick={() => toggleLike(active.id)}>
              <Heart size={18} fill={liked.has(active.id) ? 'currentColor' : 'none'} />
            </button>
            <span className="shorts-action-label">관심</span>
            <button className="shorts-action-btn"><Share2 size={18} /></button>
            <span className="shorts-action-label">공유</span>
          </div>

          <div className="shorts-duration">{active.duration}</div>
        </div>

        {/* 위아래 네비 */}
        <div className="shorts-updown">
          <button className="shorts-nav" onClick={prev} disabled={activeIndex === 0}><ChevronUp size={18} /></button>
          <button className="shorts-nav" onClick={next} disabled={activeIndex === SHORTS.length - 1}><ChevronDown size={18} /></button>
        </div>
      </div>
    </div>
  );
}
