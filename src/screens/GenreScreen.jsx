import { motion } from 'framer-motion';
import { Swords, Zap, Ghost, Puzzle, Dices, Castle, Heart, Gamepad2, Globe, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { GENRES } from '../data/content';

const GENRE_ICONS = {
  RPG: Swords,
  ACTION: Zap,
  HORROR: Ghost,
  PUZZLE: Puzzle,
  ROGUE: Dices,
  STRATEGY: Castle,
  VISUAL: Heart,
  PLATFORM: Gamepad2,
  OPENWORLD: Globe,
};

export default function GenreScreen({ selectedGenre, setSelectedGenre, onBack, onNext }) {
  return (
    <ScreenShell>
      <div className="screen-wrap" style={{ maxWidth: 900 }}>
        <div className="screen-title">게임 장르가 뭔가요?</div>
        <div className="screen-desc">장르에 따라 질문 방식이 달라져요.</div>
        <div className="genre-grid" style={{ gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
          {GENRES.map((g) => (
            <motion.div
              key={g.id}
              className={`genre-card ${selectedGenre === g.id ? 'selected' : ''}`}
              onClick={() => setSelectedGenre(g.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="genre-emoji">
                {(() => { const Icon = GENRE_ICONS[g.id] || Gamepad2; return <Icon size={28} strokeWidth={1.75} />; })()}
              </div>
              <div className="genre-name">{g.name}</div>
            </motion.div>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 8 }}>가장 가까운 장르를 골라도 괜찮아요.</div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> 이전</button>
        <button className="btn-next" disabled={!selectedGenre} onClick={onNext}>다음 <ArrowRight size={15} /></button>
      </div>
    </ScreenShell>
  );
}
