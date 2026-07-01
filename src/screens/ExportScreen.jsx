import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Download, Camera, Music2, Clapperboard } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { SNS_CONTENT } from '../data/content';

export default function ExportScreen({ selectedFormat, onBack, onRestart, onEdit }) {
  const [tab, setTab] = useState('instagram');
  const [videoError, setVideoError] = useState(false);
  const content = SNS_CONTENT[tab];
  const isCinematic = selectedFormat === 'cinematic';

  const videoContainerStyle = isCinematic
    ? { width: '100%', maxWidth: 640, aspectRatio: '16/9', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }
    : { width: '100%', maxWidth: 280, aspectRatio: '9/16', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = '/finalvideo.mp4';
    a.download = 'NARA_trailer.mp4';
    a.click();
  };

  const shareToInstagram = async () => {
    const text = `${content.caption}\n\n${content.hashtags}`;
    try { await navigator.clipboard.writeText(text); alert('캡션이 복사됐어요! 인스타그램에서 붙여넣기 하세요 📋'); }
    catch { prompt('아래 텍스트를 복사하세요:', text); }
    window.open('https://www.instagram.com', '_blank');
  };

  const shareToTiktok = async () => {
    const text = `${content.caption}\n\n${content.hashtags}`;
    try { await navigator.clipboard.writeText(text); alert('캡션이 복사됐어요! 틱톡에서 붙여넣기 하세요 📋'); }
    catch { prompt('아래 텍스트를 복사하세요:', text); }
    window.open('https://www.tiktok.com/upload', '_blank');
  };

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <motion.div className="screen-title" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          결과물
        </motion.div>
        <div className="screen-desc">
          {isCinematic ? '시네마틱 트레일러' : '숏폼 트레일러'}가 완성됐습니다. 다운로드하거나 SNS에 바로 올려보세요.
        </div>

        {/* 영상 프리뷰 - 형식에 따라 비율 다름 */}
        <div style={videoContainerStyle}>
          {!videoError ? (
            <video
              autoPlay muted loop playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setVideoError(true)}
            >
              <source src="/finalvideo.mp4" type="video/mp4" />
            </video>
          ) : (
            <>
              <span style={{ color: 'var(--text3)' }}><Clapperboard size={48} strokeWidth={1.4} /></span>
              <span style={{ fontSize: 14, color: 'var(--text3)' }}>영상 미리보기</span>
            </>
          )}
        </div>

        {/* 수정하기 버튼 */}
        {onEdit && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <button className="btn-secondary" onClick={onEdit}>
              <Pencil size={15} strokeWidth={2} /> 수정하기 (클립 재검토)
            </button>
          </div>
        )}

        {/* SNS 캡션 */}
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>SNS 캡션 자동 생성</div>
        <div className="sns-tabs">
          {[['instagram', '인스타그램'], ['tiktok', '틱톡'], ['youtube', '유튜브 쇼츠']].map(([id, label]) => (
            <div key={id} className={`sns-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</div>
          ))}
        </div>
        <div className="sns-content">
          <div className="sns-caption">{content.caption.split('\n').map((l, i) => <div key={i}>{l || <>&nbsp;</>}</div>)}</div>
          <div className="sns-hashtags">{content.hashtags}</div>
        </div>

        <div className="export-btns">
          <button className="btn-export download" onClick={downloadVideo}><Download size={16} strokeWidth={2} /> 영상 다운로드</button>
          <button className="btn-export sns" onClick={shareToInstagram}><Camera size={16} strokeWidth={2} /> 인스타그램에 올리기</button>
          <button className="btn-export sns" onClick={shareToTiktok}><Music2 size={16} strokeWidth={2} /> 틱톡에 올리기</button>
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}>← 이전</button>
        <button className="btn-next" onClick={onRestart}>처음으로</button>
      </div>
    </ScreenShell>
  );
}
