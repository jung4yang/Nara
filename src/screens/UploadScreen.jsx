import { UserRound, Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import ScreenShell from '../components/ScreenShell';
import { useLang } from '../i18n';

export default function UploadScreen({
  charPreview, setCharPreview, bgPreview, setBgPreview,
  gameTitle, setGameTitle, gameDesc, setGameDesc,
  onBack, onNext,
}) {
  const { t } = useLang();
  const u = t.flow.upload;
  const handleImg = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <ScreenShell>
      <div className="screen-wrap">
        <div className="screen-title">{u.title}</div>
        <div className="screen-desc">{u.desc}</div>
        <div className="upload-grid">
          <div className={`upload-box ${charPreview ? 'has-file' : ''}`}>
            <input type="file" accept="image/*" onChange={(e) => handleImg(e, setCharPreview)} />
            {charPreview && <img src={charPreview} className="upload-preview" style={{ display: 'block' }} alt="" />}
            <div style={{ marginBottom: 12, color: 'var(--text2)' }}><UserRound size={36} strokeWidth={1.5} /></div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{u.charImage}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{u.optional}</div>
          </div>
          <div className={`upload-box ${bgPreview ? 'has-file' : ''}`}>
            <input type="file" accept="image/*" onChange={(e) => handleImg(e, setBgPreview)} />
            {bgPreview && <img src={bgPreview} className="upload-preview" style={{ display: 'block' }} alt="" />}
            <div style={{ marginBottom: 12, color: 'var(--text2)' }}><ImageIcon size={36} strokeWidth={1.5} /></div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{u.bgImage}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{u.optional}</div>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{u.gameTitle}</label>
          <input className="form-input" value={gameTitle} onChange={(e) => setGameTitle(e.target.value)} placeholder="예: Shadow of the Forgotten Realm" />
        </div>
      </div>
      <div className="bottom-nav">
        <button className="btn-back" onClick={onBack}><ArrowLeft size={15} /> {t.common.back}</button>
        <button className="btn-next" onClick={onNext}>{t.common.next} <ArrowRight size={15} /></button>
      </div>
    </ScreenShell>
  );
}
