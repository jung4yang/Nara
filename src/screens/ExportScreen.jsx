import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, Pencil, Download, LayoutGrid, Share2, Check, ArrowLeft } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { useLang } from '../i18n';

const SNS_CONTENT = {
  cinematic: {
    x: {
      label: '𝕏',
      caption: '심해 연구시설 PELAGIA-9, 모든 교신이 끊긴 그 날. 홀로 눈을 뜬 베라(Vera)는 사라진 동료 카이를 찾아 나선다. 다크판타지 비주얼노벨 "Cold Echo", 지금 만나보세요.',
      hashtags: '#인디게임 #비주얼노벨 #다크판타지 #ColdEcho #indiegame',
      url: 'https://x.com',
    },
    youtube: {
      label: '유튜브 쇼츠',
      caption: '【신작 인디게임】 심해 연구시설에서 눈을 뜬 베라 | 비주얼노벨 Cold Echo | 출시 예정',
      hashtags: '#인디게임 #비주얼노벨 #게임트레일러 #ColdEcho #Shorts',
      url: 'https://studio.youtube.com',
    },
    instagram: {
      label: '인스타그램',
      caption: '심해 연구시설 PELAGIA-9. 모든 교신이 끊긴 그 날, 홀로 눈을 뜬 베라의 정체성을 향한 추적이 시작된다. 🌊🧊\n\n당신은 진실에 다가갈 수 있을까요.',
      hashtags: '#인디게임 #비주얼노벨 #ColdEcho #심해 #indiegame',
      url: 'https://www.instagram.com',
    },
    tiktok: {
      label: '틱톡',
      caption: '이 게임 봤어? 🧊 심해 연구시설에서 기억 없이 깨어난 주인공이 사라진 동료를 찾는 비주얼노벨인데 분위기 미쳤음',
      hashtags: '#인디게임 #비주얼노벨 #ColdEcho #FYP #게임틱톡커',
      url: 'https://www.tiktok.com/upload',
    },
  },
  short: {
    x: {
      label: '𝕏',
      caption: '밤이 되면 하나둘 모여드는 작은 카페. 사연을 주문하면 어울리는 커피 한 잔이 내려진다. 감성 숏폼 인디게임 "Coffee Talk", 지금 만나보세요.',
      hashtags: '#인디게임 #숏폼 #감성게임 #CoffeeTalk #indiegame',
      url: 'https://x.com',
    },
    youtube: {
      label: '유튜브 쇼츠',
      caption: '【신작 인디게임】 사연을 주문하는 카페 | 감성 힐링 스토리 | 출시 예정',
      hashtags: '#인디게임 #숏폼 #힐링게임 #CoffeeTalk #Shorts',
      url: 'https://studio.youtube.com',
    },
    instagram: {
      label: '인스타그램',
      caption: '말하지 못했던 것들이 여기서는 말이 됩니다. ☕✨\n\n오늘 밤, 당신의 이야기는 어떤 커피가 될까요.',
      hashtags: '#인디게임 #힐링게임 #CoffeeTalk #감성 #indiegame',
      url: 'https://www.instagram.com',
    },
    tiktok: {
      label: '틱톡',
      caption: '이 게임 알아? ☕ 사연을 말하면 그에 어울리는 커피를 내려주는 감성 게임인데 힐링 그 자체임',
      hashtags: '#인디게임 #힐링게임 #CoffeeTalk #FYP #게임틱톡커',
      url: 'https://www.tiktok.com/upload',
    },
  },
};

const TABS = ['x', 'youtube', 'instagram', 'tiktok'];

const SNS_ICONS = {
  x: (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

export default function ExportScreen({ selectedFormat, onBack, onRestart, onEdit, onGoFeed }) {
  const { t } = useLang();
  const ex = t.flow.export;
  const [tab, setTab] = useState('x');
  const [videoError, setVideoError] = useState(false);
  const [pubDone, setPubDone] = useState(false);

  const isCinematic = selectedFormat === 'cinematic';
  const content = SNS_CONTENT[isCinematic ? 'cinematic' : 'short'][tab];
  // 시네마틱(16:9) → sc_result, 숏폼(9:16) → short_result
  const resultVideo = isCinematic ? '/sc_result.mp4' : '/short_result.mp4';

  const videoContainerStyle = isCinematic
    ? { width: '100%', maxWidth: 640, aspectRatio: '16/9', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }
    : { width: '100%', maxWidth: 280, aspectRatio: '9/16', margin: '0 auto 28px', background: '#000', borderRadius: 12, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 };

  const downloadVideo = () => {
    const a = document.createElement('a');
    a.href = resultVideo;
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
          <Clapperboard size={26} /> {ex.title}
        </motion.div>
        <div className="screen-desc">
          {(isCinematic ? ex.doneCine : ex.doneShort) + ex.doneSuffix}
        </div>

        {/* 영상 프리뷰 */}
        <div style={videoContainerStyle}>
          {!videoError ? (
            <video key={resultVideo} autoPlay loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setVideoError(true)}>
              <source src={resultVideo} type="video/mp4" />
            </video>
          ) : (
            <>
              <Clapperboard size={48} style={{ color: 'var(--text3)' }} />
              <span style={{ fontSize: 14, color: 'var(--text3)' }}>{ex.preview}</span>
            </>
          )}
        </div>

        {/* 수정하기 */}
        {onEdit && (
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <button onClick={onEdit} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid var(--accent)', borderRadius: 8, color: 'var(--accent)', fontSize: 14, cursor: 'pointer' }}>
              <Pencil size={14} /> {ex.edit}
            </button>
          </div>
        )}

        {/* SNS 탭 - X / 유튜브 쇼츠 / 인스타그램 / 틱톡 */}
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text2)' }}>{ex.snsGen}</div>
        <div className="sns-tabs">
          {TABS.map((key) => (
            <div key={key} className={`sns-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)} title={SNS_CONTENT[isCinematic ? 'cinematic' : 'short'][key].label} aria-label={SNS_CONTENT[isCinematic ? 'cinematic' : 'short'][key].label}>
              {SNS_ICONS[key]}
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
          <button className="btn-export download" onClick={downloadVideo}><Download size={16} /> {ex.download}</button>
          <button
            className="btn-export sns"
            onClick={registerPublisher}
            style={pubDone ? { background: 'var(--green)', borderColor: 'var(--green)', color: 'white' } : {}}
          >
            {pubDone ? <><Check size={16} /> {ex.registered}</> : <><LayoutGrid size={16} /> {ex.register}</>}
          </button>
          <button className="btn-export sns" onClick={share}>
            <Share2 size={16} /> {ex.share}
          </button>
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" onClick={onRestart}>{ex.restart}</button>
      </div>
    </ScreenShell>
  );
}
