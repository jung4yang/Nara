import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ThumbsDown } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';

export default function SynopsisScreen({
  loading, synopsis, branchMode, onBack, onNext, onRegenerate, onApplyEdit,
}) {
  const isSummary = branchMode === 'has';
  const title = isSummary ? '시놉시스 요약' : '시놉시스';
  const desc = isSummary
    ? '업로드한 시나리오를 바탕으로 정리한 시놉시스입니다. 마음에 들지 않으면 수정하거나 재생성할 수 있습니다.'
    : 'AI가 생성한 시놉시스입니다. 마음에 들지 않으면 수정하거나 재생성할 수 있습니다.';
  const loadingText = isSummary ? '시놉시스를 정리하는 중...' : 'AI가 시놉시스를 작성 중...';

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <div className="screen-title">{title}</div>
        <div className="screen-desc">{desc}</div>

        <motion.div className="synopsis-box" layout>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text3)' }}>
              <div className="spinner" />
              <span>{loadingText}</span>
            </div>
          ) : (
            synopsis.split('\n').map((line, i) => <div key={i}>{line || <>&nbsp;</>}</div>)
          )}
        </motion.div>

        <div className="action-row">
          <button className="btn-secondary" onClick={onRegenerate}><RefreshCw size={15} strokeWidth={2} /> 재생성</button>
          <EditToggle onApply={onApplyEdit} />
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}>← 이전</button>
        <button className="btn-next" onClick={onNext} disabled={loading}>다음 →</button>
      </div>
    </ScreenShell>
  );
}

function EditToggle({ onApply }) {
  return (
    <PromptEdit onApply={onApply} />
  );
}

function PromptEdit({ onApply }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <>
      <button className="btn-dislike" onClick={() => setOpen((o) => !o)}><ThumbsDown size={15} strokeWidth={2} /> 이렇게 수정해줘</button>
      <div className={`prompt-edit ${open ? 'show' : ''}`} style={{ width: '100%' }}>
        <textarea
          placeholder="예: 더 어둡고 비극적인 분위기로, 주인공의 내면 갈등을 더 강조해줘"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn-secondary" onClick={() => { if (value.trim()) { onApply(value); setValue(''); setOpen(false); } }}>
          ✓ 적용하기
        </button>
      </div>
    </>
  );
}
