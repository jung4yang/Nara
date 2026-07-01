import { motion } from 'framer-motion';
import { FileText, MessagesSquare, FolderUp } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';

export default function BranchScreen({
  branchMode, setBranchMode, scenarioText, setScenarioText,
  scenarioFile, setScenarioFile, onBack, onNext,
}) {
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setScenarioFile(f.name);
  };

  const canNext = branchMode === 'no' || (branchMode === 'has' && (scenarioText.trim() || scenarioFile));

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <div className="screen-title">게임 스토리가 이미 있나요?</div>
        <div className="screen-desc">질문에 따라 시놉시스를 만드는 방식이 달라집니다.</div>
        <div className="branch-grid">
          <motion.div
            className={`branch-card ${branchMode === 'has' ? 'selected' : ''}`}
            onClick={() => setBranchMode('has')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="branch-icon"><FileText size={38} strokeWidth={1.6} /></div>
            <div className="branch-title">네, 있어요</div>
            <div className="branch-desc">기존 시나리오, GDD, 스토리 문서가 있다면 파일을 올려주세요. AI가 분석해서 바로 시놉시스로 정리해드립니다.</div>
            <div className="branch-tags">
              <span className="branch-tag">PDF 업로드</span>
              <span className="branch-tag">텍스트 입력</span>
              <span className="branch-tag">GDD</span>
            </div>
          </motion.div>
          <motion.div
            className={`branch-card ${branchMode === 'no' ? 'selected' : ''}`}
            onClick={() => setBranchMode('no')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="branch-icon"><MessagesSquare size={38} strokeWidth={1.6} /></div>
            <div className="branch-title">아니요, 같이 만들어요</div>
            <div className="branch-desc">AI가 5가지 질문을 드립니다. 답변만 하면 시놉시스가 자동으로 만들어집니다.</div>
            <div className="branch-tags">
              <span className="branch-tag">AI 질문 5개</span>
              <span className="branch-tag">자동 시놉시스</span>
            </div>
          </motion.div>
        </div>

        {branchMode === 'has' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className={`scenario-upload ${scenarioFile ? 'has-file' : ''}`}>
              <input type="file" accept=".pdf,.txt,.docx" onChange={handleFile} />
              <div style={{ marginBottom: 12, color: 'var(--text2)' }}><FolderUp size={32} strokeWidth={1.6} /></div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>파일 업로드</div>
              <div style={{ fontSize: 12, color: 'var(--text3)' }}>PDF, TXT, DOCX 지원</div>
              {scenarioFile && (
                <div style={{ fontSize: 13, color: 'var(--green)', marginTop: 8 }}>✓ {scenarioFile}</div>
              )}
            </div>
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, margin: '12px 0' }}>또는 직접 입력</div>
            <textarea
              className="form-textarea"
              value={scenarioText}
              onChange={(e) => setScenarioText(e.target.value)}
              placeholder={'시나리오나 스토리를 직접 붙여넣어주세요...\n\n예: 주인공 아리아는 기억을 잃은 채 멸망한 세계에서 눈을 뜬다...'}
            />
          </motion.div>
        )}
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}>← 이전</button>
        <button className="btn-next" disabled={!canNext} onClick={onNext}>
          {branchMode === 'has' ? '분석 시작 →' : '시작하기 →'}
        </button>
      </div>
    </ScreenShell>
  );
}
