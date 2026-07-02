import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLang } from '../i18n';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ onStart, onHiw }) {
  const { t } = useLang();
  return (
    <div className="hero">
      <div className="hero-video-wrap">
        <video
          id="landing-video"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', top: '50%', left: '50%',
            width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '56.25vw',
            transform: 'translate(-50%,-50%)', objectFit: 'cover', opacity: 0.55, zIndex: 1,
          }}
        >
          <source src="/mainvideo.mp4" type="video/mp4" />
        </video>
        <div className="hero-fallback" style={{ zIndex: 0 }}>
          <div className="hero-fallback-grid" />
        </div>
      </div>
      <div className="hero-overlay" />
      <motion.div
        className="hero-content"
        variants={container} initial="hidden" animate="show"
        style={{
          alignItems: 'flex-end',   // flex-start → flex-end
          textAlign: 'right',       // left → right
          position: 'absolute',
          bottom: '80px',
          right: '60px',            // left: '60px' → right: '60px'
          padding: 0,
          maxWidth: '480px',
        }}
      >
        <motion.h1 className="hero-title" variants={item}>
          <span className="logo-color" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            NARA
          </span>
        </motion.h1>
        <motion.h2 className="hero-sub-title" variants={item}>{t.hero.subtitle}</motion.h2>
        <br />
        <motion.p className="hero-desc" variants={item}>
          {t.hero.desc.map((line, i) => (
            <span key={i}>{line}{i < t.hero.desc.length - 1 && <br />}</span>
          ))}
        </motion.p>
        <motion.div className="hero-btns" variants={item}>
          <motion.button
            className="btn-start"
            onClick={onStart}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.hero.cta} <ArrowRight size={16} style={{ verticalAlign: '-3px' }} />
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="scroll-arrow" onClick={onHiw}>
        <span>{t.hero.how}</span>
        <span className="scroll-arrow-icon"><ChevronDown size={18} /></span>
      </div>
    </div>
  );
}
