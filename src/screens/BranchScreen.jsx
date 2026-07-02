import { motion } from 'framer-motion';
import { FileText, MessagesSquare, FolderUp, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { useLang } from '../i18n';

export default function BranchScreen({
  branchMode, setBranchMode, scenarioText, setScenarioText,
  scenarioFile, setScenarioFile, onBack, onNext,
}) {
  const { t } = useLang();
  const b = t.flow.branch;
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setScenarioFile(f.name);
  };

  const canNext = branchMode === 'no' || (branchMode === 'has' && (scenarioText.trim() || scenarioFile));

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <div className="screen-title">{b.title}</div>
        <div className="screen-desc">{b.desc}</div>
        <div className="branch-grid">
          <motion.div
            className={`branch-card ${branchMode === 'has' ? 'selected' : ''}`}
            onClick={() => setBranchMode('has')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="branch-icon"><FileText size={38} strokeWidth={1.6} /></div>
            <div className="branch-title">{b.hasTitle}</div>
            <div className="branch-desc">{b.hasDesc}</div>
            <div className="branch-tags">
              {b.hasTags.map((tag) => <span key={tag} className="branch-tag">{tag}</span>)}
            </div>
          </motion.div>
          <motion.div
            className={`branch-card ${branchMode === 'no' ? 'selected' : ''}`}
            onClick={() => setBranchMode('no')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="branch-icon"><MessagesSquare size={38} strokeWidth={1.6} /></div>
            <div className="branch-title">{b.noTitle}</div>
            <div className="branch-desc">{b.noDesc}</div>
            <div className="branch-tags">
              {b.noTags.map((tag) => <span key={tag} className="branch-tag">{tag}</span>)}
            </div>
          </motion.div>
        </div>

        {branchMode === 'has' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className={`scenario-upload ${scenarioFile ? 'has-file' : ''}`}>
              <input type="file" accept=".pdf,.txt,.docx" onChange={handleFile} />
              <div style={{ marginBottom: 12, color: 'var(--text2)' }}><FolderUp size={32} strokeWidth={1.6} /></div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{b.fileUpload}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>{b.fileSupport}</div>
              {scenarioFile && (
                <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 8 }}><Check size={14} /> {scenarioFile}</div>
              )}
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, margin: '12px 0' }}>{b.orInput}</div>
            <textarea
              className="form-textarea"
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              placeholder={b.placeholder}
            />
          </motion.div>
        )}
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" disabled={!canNext} onClick={onNext}>
          {branchMode === 'has' ? <>{b.analyze} <ArrowRight size={15} /></> : <>{b.start} <ArrowRight size={15} /></>}
        </button>
      </div>
    </ScreenShell>
  );
}
