import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Moon, Zap, Sword, Sparkles, Clapperboard, MoonStar, Flame, Swords, Trophy, ArrowRight } from 'lucide-react';
import { STORYBOARD, STORYBOARD_CINEMATIC, delay } from '../data/content';
import { useLang } from '../i18n';

// 숏폼용 (5장 세로)
const IMAGES     = ['/short1.png', '/short2.png', '/short3.png', '/short4.png', '/short5.png'];
const ALT_IMAGES = [null, '/short2_alt.png', '/short3_alt.png', null, null];

// 시네마틱용 (9장 가로) - 이미지 없으면 fallback emoji 표시
const CINEMATIC_IMAGES = [
  '/sc1.png','/sc2.png','/sc3.png',
  '/sc4.png','/sc5.png','/sc6.png',
  '/sc7.png','/sc8.png','/sc9.png',
];

const FALLBACK_ICONS = [Moon, Zap, Sword, Sparkles, Clapperboard, MoonStar, Flame, Swords, Trophy];

export default function StoryboardScreen({ selectedGenre, selectedFormat, onRegenAll, onGenerateVideo, regenKey }) {
  const { t } = useLang();
  const sb = t.flow.storyboard;
  const isCinematic = selectedFormat === 'cinematic';
  const data    = isCinematic
    ? (STORYBOARD_CINEMATIC[selectedGenre] || STORYBOARD_CINEMATIC.RPG)
    : (STORYBOARD[selectedGenre] || STORYBOARD.RPG);
  const images  = isCinematic ? CINEMATIC_IMAGES : IMAGES;
  const altImgs = isCinematic ? new Array(9).fill(null) : ALT_IMAGES;

  const [liked,     setLiked]     = useState(new Set());
  const [disliked,  setDisliked]  = useState(new Set());
  const [imgSrc,    setImgSrc]    = useState(images);
  const [imgError,  setImgError]  = useState(new Array(data.length).fill(false));
  const [loadingCut,setLoadingCut]= useState(-1);
  const [panelCut,   setPanelCut]  = useState(-1);
  const [panelValue, setPanelValue]= useState('');
  const [panelPos,   setPanelPos]  = useState({ top: 0, left: 0, side: 'right' });

  // 모든 컷에 좋아요를 눌러야 영상 생성으로 넘어갈 수 있음
  const allLiked = liked.size === data.length;

  const toggleLike = (i) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
    setDisliked((prev) => { const n = new Set(prev); n.delete(i); return n; });
  };

  const openDislike = (i, e) => {
    setDisliked((prev) => new Set(prev).add(i));
    setLiked((prev)    => { const n = new Set(prev); n.delete(i); return n; });
    const card = e.currentTarget.closest('.sb-card');
    const rect = card.getBoundingClientRect();
    const top  = Math.min(rect.top + window.scrollY, window.innerHeight - 280);
    const goRight = rect.right + 252 < window.innerWidth;
    setPanelPos({
      top,
      left: goRight ? rect.right + 12 : rect.left - 252,
      side: goRight ? 'right' : 'left',
    });
    setPanelCut(i);
    setPanelValue('');
  };

  const closePanel = () => setPanelCut(-1);

  const applyDislike = async () => {
    const i = panelCut;
    closePanel();
    if (i < 0) return;
    setLoadingCut(i);
    await delay(2000);
    if (altImgs[i]) {
      setImgSrc((prev)   => prev.map((s, idx) => (idx === i ? altImgs[i] : s)));
      setImgError((prev) => prev.map((e, idx) => (idx === i ? false : e)));
    }
    setLoadingCut(-1);
    setDisliked((prev) => { const n = new Set(prev); n.delete(i); return n; });
  };

  // 카드 비율: 숏폼=세로(9:16), 시네마틱=가로(16:9)
  const cardStyle = isCinematic
    ? { width: '100%' }
    : { flex: '0 0 160px' };

  const imgStyle = isCinematic
    ? { paddingTop: '56.25%', position: 'relative' }  // 16:9
    : { paddingTop: '177.77%', position: 'relative' }; // 9:16

  // 그리드: 숏폼=가로스크롤, 시네마틱=3×3
  const gridStyle = isCinematic
    ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }
    : { display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, marginBottom: 24 };

  return (
    <div className="screen active" id="s-storyboard">
      <div className="sb-wrap">
        <div className="sb-header">
          <div className="sb-title-area">
            <div className="sb-title">{sb.title}</div>
            <div className="sb-desc">
              {isCinematic ? sb.descCine : sb.descShort}
            </div>
          </div>
          <div className="sb-count">{liked.size} / {data.length} {sb.confirm}</div>
        </div>

        <div style={gridStyle}>
          {data.map((d, i) => (
            <motion.div
              key={`${regenKey}-${i}`}
              className={`sb-card ${liked.has(i) ? 'liked' : ''} ${disliked.has(i) ? 'disliked' : ''}`}
              style={cardStyle}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
            >
              {/* 이미지 영역 - 비율 유지 */}
              <div style={{ ...imgStyle, background: '#111', overflow: 'hidden', borderRadius: '8px 8px 0 0' }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                  {!imgError[i] ? (
                    <img
                      src={imgSrc[i]}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={() => setImgError((prev) => prev.map((e, idx) => (idx === i ? true : e)))}
                      alt=""
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: 'linear-gradient(135deg,#1e1a3a,#2d1f4a)' }}>
                      {(() => { const Ic = FALLBACK_ICONS[i] || Clapperboard; return <Ic size={isCinematic ? 40 : 32} style={{ color: 'var(--text3)' }} />; })()}
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{sb.noImage}</span>
                    </div>
                  )}
                  <AnimatePresence>
                    {loadingCut === i && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,20,0.88)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}
                      >
                        <div style={{ width: 28, height: 28, border: '2px solid rgba(159,182,209,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        <span style={{ fontSize: 11, color: 'var(--accent2)', letterSpacing: 0.5 }}>{sb.editing}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="sb-num">{String(i + 1).padStart(2, '0')}</div>
                </div>
              </div>

              <div style={{ padding: '8px 10px', fontSize: 11, color: 'var(--text2)', lineHeight: 1.4 }}>{d.d}</div>
              <div className="sb-actions">
                <div className={`sb-btn like ${liked.has(i) ? 'liked' : ''}`} onClick={() => toggleLike(i)} title={sb.like}><ThumbsUp size={15} strokeWidth={2} /></div>
                <div className={`sb-btn dislike ${disliked.has(i) ? 'disliked' : ''}`} onClick={(e) => openDislike(i, e)} title={sb.dislike}><ThumbsDown size={15} strokeWidth={2} /></div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="sb-footer-hint">{sb.footerHint}</div>
      </div>

      <div className="sb-float-btns">
        <motion.button className="btn-regen" onClick={onRegenAll} whileTap={{ scale: 0.96 }}>{sb.regenAll}</motion.button>
        <motion.button className="btn-gen-video" onClick={onGenerateVideo} disabled={!allLiked} whileHover={allLiked ? { scale: 1.03 } : {}} whileTap={allLiked ? { scale: 0.97 } : {}}>{sb.genVideo} <ArrowRight size={15} /></motion.button>
      </div>

      <AnimatePresence>
        {panelCut >= 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: panelPos.side === 'right' ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            style={{
              position: 'fixed', zIndex: 300,
              top: panelPos.top, left: panelPos.left,
              width: 240,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: 20,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* 꼬리: 오른쪽에 뜰 때 왼쪽 꼬리, 왼쪽에 뜰 때 오른쪽 꼬리 */}
            {panelPos.side === 'right' ? (
              <>
                <div style={{ position: 'absolute', top: 20, left: -8, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid var(--border)' }} />
                <div style={{ position: 'absolute', top: 21, left: -6, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '7px solid var(--surface)' }} />
              </>
            ) : (
              <>
                <div style={{ position: 'absolute', top: 20, right: -8, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid var(--border)' }} />
                <div style={{ position: 'absolute', top: 21, right: -6, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '7px solid var(--surface)' }} />
              </>
            )}
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{sb.panelTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>{sb.panelDesc}</div>
            <textarea
              style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', height: 90, marginBottom: 10 }}
              placeholder={sb.panelPlaceholder}
              value={panelValue}
              onChange={(e) => setPanelValue(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={closePanel} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', fontSize: 12, cursor: 'pointer' }}>{sb.close}</button>
              <button onClick={applyDislike} style={{ flex: 1, padding: '8px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>{sb.regenerate}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
