import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, Heart, Share2, ChevronUp, ChevronDown } from 'lucide-react';

const SHORTS = [
  { id: 's1', title: 'Shadow of Aria — 메인 트레일러', studio: 'DeepLight Studio', tags: ['RPG', '다크판타지'], duration: '0:30', colorClass: 'color-purple' },
  { id: 's2', title: 'Neon Blade — 액션 하이라이트', studio: 'PixelForge', tags: ['액션', '사이버펑크'], duration: '0:20', colorClass: 'color-cyan' },
  { id: 's3', title: 'Whisper Forest — 게임플레이', studio: 'MoonSeed', tags: ['퍼즐', '힐링'], duration: '0:25', colorClass: 'color-green' },
  { id: 's4', title: 'Void Runner — 티저', studio: 'StarBurst', tags: ['로그라이크', '슈팅'], duration: '0:15', colorClass: 'color-red' },
  { id: 's5', title: 'Crystal Cave — 예고편', studio: 'GemStudio', tags: ['어드벤처'], duration: '0:35', colorClass: 'color-purple' },
];

// 유튜브 쇼츠식 세로 슬라이드: 다음(아래로)이면 새 카드가 아래에서 올라오고, 이전이면 위에서 내려옴
const variants = {
  enter: (dir) => ({ y: dir >= 0 ? '100%' : '-100%', opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir) => ({ y: dir >= 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function ShortsViewer({ initialIndex = 0, onClose }) {
  const [[activeIndex, direction], setPage] = useState([initialIndex, 0]);
  const [liked, setLiked] = useState(new Set());

  const active = SHORTS[activeIndex];

  // dir: +1 다음(아래), -1 이전(위)
  const paginate = (dir) => {
    setPage(([i]) => {
      const ni = i + dir;
      if (ni < 0 || ni >= SHORTS.length) return [i, 0];
      return [ni, dir];
    });
  };

  const toggleLike = (id) => {
    setLiked((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  // 키보드
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') paginate(1);
      if (e.key === 'ArrowUp') paginate(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // 휠 스크롤
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) < 24) return;
    paginate(e.deltaY > 0 ? 1 : -1);
  };

  return (
    <div className="shorts-viewer-overlay" onClick={onClose} onWheel={handleWheel}>
      <div className="shorts-viewer" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 (좌측 상단) */}
        <button className="shorts-close" onClick={onClose}><ArrowLeft size={26} /></button>

        {/* 카드 스테이지 (클리핑 영역) */}
        <div className="shorts-stage">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeIndex}
              className={`shorts-card ${active.colorClass}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ y: { type: 'spring', stiffness: 320, damping: 34 }, opacity: { duration: 0.18 } }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                if (info.offset.y < -70 || info.velocity.y < -450) paginate(1);
                else if (info.offset.y > 70 || info.velocity.y > 450) paginate(-1);
              }}
            >
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
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 위아래 네비 */}
        <div className="shorts-updown">
          <button className="shorts-nav" onClick={() => paginate(-1)} disabled={activeIndex === 0}><ChevronUp size={18} /></button>
          <button className="shorts-nav" onClick={() => paginate(1)} disabled={activeIndex === SHORTS.length - 1}><ChevronDown size={18} /></button>
        </div>
      </div>
    </div>
  );
}
