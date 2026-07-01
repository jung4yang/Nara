import { motion } from 'framer-motion';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({ onStart, onHiw }) {
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
          <span className="logo-color" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            NARA
          </span>
        </motion.h1>
        <motion.h2 className="hero-sub-title" variants={item}>Let Your Game Stories Fly</motion.h2>
        <br />
        <motion.p className="hero-desc" variants={item}>
          게임 에셋만 넣으면 AI가 시놉시스부터<br />숏폼 트레일러까지 자동으로 만들어드립니다.
        </motion.p>
        <motion.div className="hero-btns" variants={item}>
          <motion.button
            className="btn-start"
            onClick={onStart}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            무료로 시작하기 →
          </motion.button>
        </motion.div>
      </motion.div>
      <div className="scroll-arrow" onClick={onHiw}>
        <span>HOW IT WORKS</span>
        <span className="scroll-arrow-icon">↓</span>
      </div>
    </div>
  );
}
