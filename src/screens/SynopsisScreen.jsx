import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ThumbsDown, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { useLang } from '../i18n';

export default function SynopsisScreen({
  loading, synopsis, branchMode, onBack, onNext, onRegenerate, onApplyEdit,
}) {
  const { t } = useLang();
  const s = t.flow.synopsis;
  const isSummary = branchMode === 'has';
  const title = isSummary ? s.titleSummary : s.title;
  const desc = isSummary ? s.descSummary : s.desc;
  const loadingText = isSummary ? s.loadingSummary : s.loading;

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
          <button className="btn-secondary" onClick={onRegenerate}><RefreshCw size={15} strokeWidth={2} /> {s.regen}</button>
          <EditToggle onApply={onApplyEdit} />
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" onClick={onNext} disabled={loading}>{t.common.next} <ArrowRight size={15} /></button>
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
  const { t } = useLang();
  const s = t.flow.synopsis;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <>
      <button className="btn-dislike" onClick={() => setOpen((o) => !o)}><ThumbsDown size={15} strokeWidth={2} /> {s.editBtn}</button>
      <div className={`prompt-edit ${open ? 'show' : ''}`} style={{ width: '100%' }}>
        <textarea
          placeholder={s.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button className="btn-secondary" onClick={() => { if (value.trim()) { onApply(value); setValue(''); setOpen(false); } }}>
          <Check size={14} /> {s.apply}
        </button>
      </div>
    </>
  );
}
