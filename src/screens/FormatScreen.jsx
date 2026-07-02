import { motion } from 'framer-motion';
import { Clapperboard, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';

export default function FormatScreen({ selectedFormat, setSelectedFormat, onBack, onNext }) {
  return (
    <ScreenShell>
      <div className="screen-wrap" style={{ maxWidth: 800 }}>
        <div className="screen-title">어떤 영상을 만들까요?</div>
        <div className="screen-desc">목적에 따라 영상 구조와 포맷이 달라집니다.</div>
        <div className="format-grid">
          <motion.div
            className={`format-card ${selectedFormat === 'cinematic' ? 'selected' : ''}`}
            onClick={() => setSelectedFormat('cinematic')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="format-badge cinematic">시네마틱</div>
            <div className="format-icon"><Clapperboard size={34} strokeWidth={1.75} /></div>
            <div className="format-title">Cinematic Trailer</div>
            <div className="format-duration">30~45초 · 16:9 · 게임 론칭용</div>
            <div className="format-desc">세계관과 캐릭터를 드라마틱하게 소개해요. 스팀 페이지와 유튜브 채널에 올리기 좋아요.</div>
            <div className="format-tags">
              <span className="format-tag">스팀 페이지</span>
              <span className="format-tag">유튜브</span>
              <span className="format-tag">론칭</span>
            </div>
          </motion.div>
          <motion.div
            className={`format-card ${selectedFormat === 'shortform' ? 'selected' : ''}`}
            onClick={() => setSelectedFormat('shortform')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="format-badge shortform">숏폼</div>
            <div className="format-icon"><Smartphone size={34} strokeWidth={1.75} /></div>
            <div className="format-title">Story-driven Short Form</div>
            <div className="format-duration">15초 · 9:16 · SNS 바이럴용</div>
            <div className="format-desc">캐릭터 이면의 이야기를 숏폼으로 연재해요. 틱톡·릴스·쇼츠에 최적화되어 있어요.</div>
            <div className="format-tags">
              <span className="format-tag">틱톡</span>
              <span className="format-tag">릴스</span>
              <span className="format-tag">쇼츠</span>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> 이전</button>
        <button className="btn-next" disabled={!selectedFormat} onClick={onNext}>다음 <ArrowRight size={15} /></button>
      </div>
    </ScreenShell>
  );
}
