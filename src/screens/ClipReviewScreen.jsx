import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, CloudFog, Footprints, Swords, Sparkles, Clapperboard, MoonStar, Flame, Zap, Trophy, ArrowLeft, ArrowRight } from 'lucide-react';
import { CLIP_PREVIEWS, STORYBOARD_CINEMATIC, delay } from '../data/content';
import { useLang } from '../i18n';

const CLIPS     = ['/vid01.mp4','/vid02.mp4','/vid03.mp4','/vid04.mp4','/vid05.mp4'];
// const ALT_CLIPS = ['/vid01_alt.mp4','/vid02_alt.mp4','/vid03_alt.mp4','/vid04_alt.mp4','/vid05_alt.mp4']; 수정본 추가 예정

// 시네마틱용 클립 9장
const CINEMATIC_CLIPS     = ['/sc1.mp4','/sc2.mp4','/sc3.mp4','/sc4.mp4','/sc5.mp4','/sc6.mp4','/sc7.mp4','/sc8.mp4','/sc9.mp4'];
// const CINEMATIC_ALT_CLIPS = ['/sc1_alt.mp4','/sc2_alt.mp4','/sc3_alt.mp4','/sc4_alt.mp4','/sc5_alt.mp4','/sc6_alt.mp4','/sc7_alt.mp4','/sc8_alt.mp4','/sc9_alt.mp4']; 수정본 추가 예정

const FALLBACK_ICONS = [CloudFog, Footprints, Swords, Sparkles, Clapperboard, MoonStar, Flame, Zap, Trophy];

export default function ClipReviewScreen({ selectedGenre, selectedFormat, onBack, onNext }) {
    const { t } = useLang();
    const c = t.flow.clip;
    const isCinematic = selectedFormat === 'cinematic';
    const data     = isCinematic
        ? (STORYBOARD_CINEMATIC[selectedGenre] || STORYBOARD_CINEMATIC.RPG)
        : (CLIP_PREVIEWS[selectedGenre] || CLIP_PREVIEWS.RPG);
    const clips    = isCinematic ? CINEMATIC_CLIPS    : CLIPS;
    const count    = isCinematic ? 9 : 5;

    const [src,        setSrc]        = useState(clips);
    const [error,      setError]      = useState(new Array(count).fill(false));
    const [liked,      setLiked]      = useState(new Set());
    const [disliked,   setDisliked]   = useState(new Set());
    const [loadingCut, setLoadingCut] = useState(-1);
    const [panelCut,   setPanelCut]   = useState(-1);
    const [panelValue, setPanelValue] = useState('');
    const [panelPos,   setPanelPos]   = useState({ top: 0, left: 0 });

    const allLiked = liked.size === count;

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
        const top  = Math.min(rect.top + window.scrollY, window.innerHeight - 260);
        const left = rect.right + 12;
        setPanelPos({ top, left: left + 240 > window.innerWidth ? rect.left - 252 : left });
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
        // 수정본(alt clip)이 아직 없어 원본 유지 — 준비되면 여기서 교체
        setError((prev) => prev.map((e, idx) => (idx === i ? false : e)));
        setLoadingCut(-1);
        setDisliked((prev) => { const n = new Set(prev); n.delete(i); return n; });
    };

    const gridStyle = isCinematic
        ? { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }
        : { display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12, marginBottom: 24 };

    const cardStyle = isCinematic ? { width: '100%' } : { flex: '0 0 160px' };

    const imgStyle = isCinematic
        ? { paddingTop: '56.25%', position: 'relative', background: '#111', overflow: 'hidden', borderRadius: '8px 8px 0 0' }
        : { paddingTop: '177.77%', position: 'relative', background: '#111', overflow: 'hidden', borderRadius: '8px 8px 0 0' };

    return (
        <div className="screen active" id="s-clipreview">
            <div className="sb-wrap">
                <div className="sb-header">
                    <div className="sb-title-area">
                        <div className="sb-title">{c.title}</div>
                        <div className="sb-desc">
                            {isCinematic ? c.descCine : c.descShort}
                        </div>
                    </div>
                    <div className="sb-count">{liked.size} / {count} {c.confirm}</div>
                </div>

                <div style={gridStyle}>
                    {Array.from({ length: count }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`sb-card ${liked.has(i) ? 'liked' : ''} ${disliked.has(i) ? 'disliked' : ''}`}
                            style={cardStyle}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.06 }}
                            whileHover={{ y: -4 }}
                        >
                            <div style={imgStyle}>
                                <div style={{ position: 'absolute', inset: 0 }}>
                                    {!error[i] ? (
                                        <video
                                            key={src[i]}
                                            src={src[i]}
                                            autoPlay muted loop playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            onError={() => setError((prev) => prev.map((e, idx) => (idx === i ? true : e)))}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, background: 'linear-gradient(135deg,#1e1a3a,#2d1f4a)' }}>
                                            {(() => { const Ic = FALLBACK_ICONS[i] || Clapperboard; return <Ic size={isCinematic ? 40 : 32} style={{ color: 'var(--text3)' }} />; })()}
                                            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{c.noClip}</span>
                                        </div>
                                    )}
                                    <AnimatePresence>
                                        {loadingCut === i && (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,20,0.88)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}
                                            >
                                                <div style={{ width: 28, height: 28, border: '2px solid rgba(159,182,209,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                                <span style={{ fontSize: 11, color: 'var(--accent2)', letterSpacing: 0.5 }}>{c.editing}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div className="sb-num">{String(i + 1).padStart(2, '0')}</div>
                                </div>
                            </div>
                            <div style={{ padding: '8px 10px', fontSize: 11, color: 'var(--text2)', lineHeight: 1.4 }}>
                                {data[i]?.d || ''}
                            </div>
                            <div className="sb-actions">
                                <div className={`sb-btn like ${liked.has(i) ? 'liked' : ''}`} onClick={() => toggleLike(i)} title={c.like}><ThumbsUp size={15} strokeWidth={2} /></div>
                                <div className={`sb-btn dislike ${disliked.has(i) ? 'disliked' : ''}`} onClick={(e) => openDislike(i, e)} title={c.dislike}><ThumbsDown size={15} strokeWidth={2} /></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="sb-footer-hint">{c.footerHint}</div>
            </div>

            <div className="bottom-nav" style={{ position: 'sticky', bottom: 0, background: 'var(--bg)' }}>
                <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
                <button className="btn-next" disabled={!allLiked} onClick={onNext}>{c.genFinal} <ArrowRight size={15} /></button>
            </div>

            {/* 말풍선 패널 */}
            <AnimatePresence>
                {panelCut >= 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, x: -8 }}
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
                        <div style={{ position: 'absolute', top: 20, left: -8, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid var(--border)' }} />
                        <div style={{ position: 'absolute', top: 21, left: -6, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderRight: '7px solid var(--surface)' }} />
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{c.panelTitle}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>{c.panelDesc}</div>
                        <textarea
                            style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', height: 90, marginBottom: 10 }}
                            placeholder={c.panelPlaceholder}
                            value={panelValue}
                            onChange={(e) => setPanelValue(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={closePanel} style={{ padding: '8px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', fontSize: 12, cursor: 'pointer' }}>{c.close}</button>
                            <button onClick={applyDislike} style={{ flex: 1, padding: '8px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>{c.regenerate}</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
