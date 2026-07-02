import { useState } from 'react';
import { motion } from 'framer-motion';
import ScreenShell from '../components/ScreenShell';

const SNS_CONTENT = {
  x: {
    label: '𝕏',
    caption: '기억도 이름도 없는 소녀가 멸망한 세계에서 눈을 뜬다. 유령에게 쫓기며 잃어버린 진실을 향해 달려가는 다크 판타지 RPG. 지금 플레이해보세요.',
    hashtags: '#인디게임 #RPG #다크판타지 #게임개발 #indiegame',
    url: 'https://x.com',
  },
  youtube: {
    label: '유튜브 쇼츠',
    caption: '【신작 인디게임】 기억을 잃은 소녀의 여정 | 다크 판타지 RPG | 출시 예정',
    hashtags: '#인디게임 #RPG #게임트레일러 #신작게임 #Shorts',
    url: 'https://studio.youtube.com',
  },
  instagram: {
    label: '인스타그램',
    caption: '기억을 잃은 소녀가 멸망한 세계에서 눈을 뜬다. 🌑✨\n\n당신의 선택이 세계의 운명을 바꿉니다.',
    hashtags: '#인디게임 #RPG #다크판타지 #게임추천 #indiegame',
    url: 'https://www.instagram.com',
  },
  tiktok: {
    label: '틱톡',
    caption: '이 게임 해봤어? 🤯 기억 잃은 주인공이 멸망한 세계 탐험하는 RPG인데 진짜 분위기 미쳤음',
    hashtags: '#인디게임 #게임추천 #RPG #FYP #게임틱톡커',
    url: 'https://www.tiktok.com/upload',
  },
};

const TABS = ['x', 'youtube', 'instagram', 'tiktok'];

export default function ExportScreen({ selectedFormat, onBack, onRestart, onEdit, onGoFeed }) {
  const [tab, setTab] = useState('x');
  const [videoError, setVideoError] = useState(false);
  const [pubDone, setPubDone] = useState(false);

  const isCinematic = selectedFormat === 'cinematic';
  const content = SNS_CONTENT[tab];

  const videoContainerStyle = isCinematic
    ? { width: '100%', maxWidth: 640, aspectRatio: '16/9', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }
    : { width: '100%', maxWidth: 280, aspectRatio: '9/16', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = '/short_result.mp4';
    a.download = 'NARA_trailer.mp4';
    a.click();
  };

  const registerPublisher = () => {
    setPubDone(true);
    setTimeout(() => {
      if (onGoFeed) onGoFeed();
    }, 1200);
  };

  const share = async () => {
    const text = `${content.caption}\n\n${content.hashtags}`;
    try {
      await navigator.clipboard.writeText(text);
      alert(`캡션이 복사됐어요! ${content.label}에서 붙여넣기 하세요 📋`);
    } catch {
      prompt('아래 텍스트를 복사하세요:', text);
    }
    window.open(content.url, '_blank');
  };

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <motion.div className="screen-title" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          🎬 결과물
        </motion.div>
        <div className="screen-desc">
          {isCinematic ? '시네마틱 트레일러' : '숏폼 트레일러'}가 완성됐습니다.
        </div>

        {/* 영상 프리뷰 */}
        <div style={videoContainerStyle}>
          {!videoError ? (
            <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setVideoError(true)}>
              <source src="/short_result.mp4" type="video/mp4" />
            </video>
          ) : (
            <>
              <span style={{ fontSize: 48 }}>🎬</span>
              <span style={{ fontSize: 14, color: 'var(--text3)' }}>영상 미리보기</span>
            </>
          )}
        </div>

        {/* 수정하기 */}
        {onEdit && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <button onClick={onEdit} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--accent)', borderRadius: 8, color: 'var(--accent)', fontSize: 14, cursor: 'pointer' }}>
              ✏️ 수정하기 (클립 재검토)
            </button>
          </div>
        )}

        {/* SNS 탭 - X / 유튜브 쇼츠 / 인스타그램 / 틱톡 */}
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>SNS 캡션 자동 생성</div>
        <div className="sns-tabs">
          {TABS.map((key) => (
            <div key={key} className={`sns-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
              {SNS_CONTENT[key].label}
            </div>
          ))}
        </div>
        <div className="sns-content">
          <div className="sns-caption">
            {content.caption.split('\n').map((l, i) => <div key={i}>{l || <>&nbsp;</>}</div>)}
          </div>
          <div className="sns-hashtags">{content.hashtags}</div>
        </div>

        {/* 버튼 3개: 다운로드 / 퍼블리셔 등록 / 공유하기 */}
        <div className="export-btns">
          <button className="btn-export download" onClick={downloadVideo}>⬇ 영상 다운로드</button>
          <button
            className="btn-export sns"
            onClick={registerPublisher}
            style={pubDone ? { background: 'var(--green)', borderColor: 'var(--green)', color: 'white' } : {}}
          >
            {pubDone ? '✓ 등록 완료!' : '▣ 퍼블리셔에 등록'}
          </button>
          <button className="btn-export sns" onClick={share}>
            📤 공유하기
          </button>
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}>← 이전</button>
        <button className="btn-next" onClick={onRestart}>처음으로</button>
      </div>
    </ScreenShell>
  );
}
