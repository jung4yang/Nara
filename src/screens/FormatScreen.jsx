import { motion } from 'framer-motion';
import { Clapperboard, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { useLang } from '../i18n';

export default function FormatScreen({ selectedFormat, setSelectedFormat, onBack, onNext }) {
  const { t } = useLang();
  const f = t.flow.format;
  return (
    <ScreenShell>
      <div className="screen-wrap" style={{ maxWidth: 800 }}>
        <div className="screen-title">{f.title}</div>
        <div className="screen-desc">{f.desc}</div>
        <div className="format-grid">
          <motion.div
            className={`format-card ${selectedFormat === 'cinematic' ? 'selected' : ''}`}
            onClick={() => setSelectedFormat('cinematic')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="format-badge cinematic">{f.cineBadge}</div>
            <div className="format-icon"><Clapperboard size={34} strokeWidth={1.75} /></div>
            <div className="format-title">Cinematic Trailer</div>
            <div className="format-duration">{f.cineDur}</div>
            <div className="format-desc">{f.cineDesc}</div>
            <div className="format-tags">
              {f.cineTags.map((tag) => <span key={tag} className="format-tag">{tag}</span>)}
            </div>
          </motion.div>
          <motion.div
            className={`format-card ${selectedFormat === 'shortform' ? 'selected' : ''}`}
            onClick={() => setSelectedFormat('shortform')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="format-badge shortform">{f.shortBadge}</div>
            <div className="format-icon"><Smartphone size={34} strokeWidth={1.75} /></div>
            <div className="format-title">Story-driven Short Form</div>
            <div className="format-duration">{f.shortDur}</div>
            <div className="format-desc">{f.shortDesc}</div>
            <div className="format-tags">
              {f.shortTags.map((tag) => <span key={tag} className="format-tag">{tag}</span>)}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" disabled={!selectedFormat} onClick={onNext}>{t.common.next} <ArrowRight size={15} /></button>
      </div>
    </ScreenShell>
  );
}
